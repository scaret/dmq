import models_pb from "../proto-gen/models_pb"
import WorkerAgent from "../worker/WorkerAgent"
import {MsgReq, ThreadControlMessage, DatagramMessage, QuicMessage} from "../MsgMainToWorker";
import { EventEmitter } from "eventemitter3";
import {
    DatagramSignalSent,
    DatagramDownstreamMessage,
    ThreadControlAckMessage,
    QuicDownstreamMessage, QuicSignalSent
} from "../MsgWorkerToMain"

import {
    DeliveryMessage,
    DMQClientOptions,
    PublishOptions,
    PublishTrunkResult, SubscribeOptions
} from "../UserInterface";

class DMQClient extends EventEmitter{
    worker: Worker | WorkerAgent;
    interval: number;
    topics: string[] = [];
    thread: {
        pendingReqs: MsgReq[],
    } = {pendingReqs: []}
    dgram: {
        msgid: number;
        pendingReqs: MsgReq[],
        ack: number[],//粗暴
    } = {msgid: 0, pendingReqs: [], ack: []}
    quic: {
        msgid: number;
        pendingReqs: MsgReq[],
        ack: number[],//粗暴
    } = {msgid: 0, pendingReqs: [], ack: []}
    private timer?: ReturnType<typeof setInterval>;
    private timeout: number;

    constructor(options: DMQClientOptions) {
        super();
        if (options.worker) {
            this.worker = new Worker(new URL('../worker/WorkerAgent.ts', import.meta.url));
        } else {
            this.worker = new WorkerAgent();
        }
        this.interval = options.timeoutInterval || 1000
        this.timeout = options.dgramTimeout || 3000
        this.startTimeoutChecker()
        this.worker.onmessage = (evt: { data: ThreadControlAckMessage | DatagramDownstreamMessage | DatagramSignalSent }) => {
            // console.log("onmessage", evt.data);
            if (evt.data.type === "DMQ_CONNECT_SUCCESS" || evt.data.type === "DMQ_CONNECT_FAIL") {
                const index = this.thread.pendingReqs.findIndex((msg) => msg.type === "DMQ_CONNECT");
                if (index === -1) {
                    console.error(`Unexpected Response`, this.thread.pendingReqs);
                    return;
                }
                const req = this.thread.pendingReqs[index];
                this.thread.pendingReqs.splice(index, 1);
                evt.data.type === "DMQ_CONNECT_SUCCESS" ? req.resolve(evt.data) : req.reject(evt.data)
            } else if (evt.data.type === "DMQ_DATAGRAM_SIGNAL_SENT") {
                const signalSent = evt.data as DatagramSignalSent;
                const msgReq = this.dgram.pendingReqs.find((req) => req.msgid === signalSent.msgid);
                if (msgReq) {
                    msgReq.T1 = signalSent.T1;
                }
            } else if (evt.data.type === "DMQ_DOWNSTREAM") {
                const downstreamMessage = evt.data as DatagramDownstreamMessage
                const pbMsgDown = models_pb.DownstreamDgram.deserializeBinary(downstreamMessage.buf);
                this.dgram.ack = ([] as number[]).concat(pbMsgDown.getAckList())
                const respondTo = pbMsgDown.getRespondto()
                pbMsgDown.getAckList().forEach((ack: number, index) => {
                    const i = this.dgram.pendingReqs.findIndex((req) => req.msgid === ack);
                    const msgReq = this.dgram.pendingReqs[i];
                    if (!msgReq) {
                        return;
                    }
                    msgReq.ackReceived = true;
                    msgReq.T2 = pbMsgDown.getAckt2List()[index];
                    if (msgReq.type === "DMQ_REPORT") {
                        this.dgram.pendingReqs.splice(i, 1);
                        const publishRes: PublishTrunkResult = {
                            T1: msgReq.T1,
                            T2: pbMsgDown.getAckt2List()[index],
                        }
                        msgReq.resolve(publishRes);
                    }
                });
                if (respondTo) {
                    this.dgram.ack.push(respondTo);
                    const i = this.dgram.pendingReqs.findIndex((req) => req.msgid === respondTo);
                    if (i < 0) {
                        // console.error(`Res not found`, respondTo, i);
                    } else {
                        const msgReq = this.dgram.pendingReqs[i];
                        this.dgram.pendingReqs.splice(i, 1);
                        const publishRes: PublishTrunkResult = {
                            T1: msgReq.T1,
                            T2: pbMsgDown.getT2(),
                            T4: downstreamMessage.T4
                        }
                        msgReq.resolve(publishRes);
                    }
                }
                if (pbMsgDown.getType() === "DELIVERY"){
                    let buf = (pbMsgDown.getPayload() as Uint8Array);
                    let pbDelivery = models_pb.Delivery.deserializeBinary(buf);
                    this.emit("message", {
                        topic: pbDelivery.getTopic(),
                        payload: pbDelivery.getPayload()
                    } as DeliveryMessage)
                }
            } else if (evt.data.type === "DMQ_QUIC_SIGNAL_SENT") {
                const signalSent = evt.data as QuicSignalSent;
                const msgReq = this.quic.pendingReqs.find((req) => req.msgid === signalSent.msgid);
                if (msgReq) {
                    msgReq.T1 = signalSent.T1;
                }
            }else if (evt.data.type === "DMQ_QUIC_DOWNSTREAM"){
                const data = evt.data as QuicDownstreamMessage;
                // console.log("data.buf", data.buf)
                const downstreamMsg = models_pb.DownstreamMsg.deserializeBinary(data.buf);
                const respondTo = downstreamMsg.getRespondto();
                if (respondTo) {
                    const i = this.quic.pendingReqs.findIndex((req) => req.msgid === respondTo);
                    if (i < 0) {
                        // console.error(`Res not found`, respondTo, i);
                    } else {
                        const msgReq = this.quic.pendingReqs[i];
                        this.quic.pendingReqs.splice(i, 1);
                        const subscribeRes = {
                            T1: msgReq.T1,
                            T2: downstreamMsg.getT2(),
                            T4: data.T4,
                        }
                        msgReq.resolve(subscribeRes);
                    }
                }
            }else{
                console.log("Unrecognized msg", evt.data.type, evt.data);
            }
        }
    }

    private async sendThreadMsg(message: ThreadControlMessage, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this.thread.pendingReqs.push({
                type: 'DMQ_CONNECT',
                resolve,
                reject
            });
            this.worker.postMessage(message)
        });
    }

    private async sendDgramMsg(message: DatagramMessage, msgid: number, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this.dgram.pendingReqs.push({
                msgid: msgid,
                type: message.type,
                resolve,
                reject
            });
            this.worker.postMessage(message)
        });
    }

    private async sendQuicMsg(message: QuicMessage, msgid: number, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this.quic.pendingReqs.push({
                msgid: msgid,
                type: message.type,
                resolve,
                reject
            });
            this.worker.postMessage(message)
        });
    }

    private startTimeoutChecker() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            const now = Date.now();
            for (let i = this.dgram.pendingReqs.length - 1; i >= 0; i--) {
                let req = this.dgram.pendingReqs[i];
                if (req.T1 && now - req.T1 > this.timeout) {
                    this.dgram.pendingReqs.splice(i, 1);
                    if (req.type === "DMQ_REQUEST" && req.ackReceived) {
                        req.resolve({
                            T1: req.T1,
                            T2: req.T2,
                        })
                    }
                    req.reject(new Error("TIMEOUT"));
                }
            }
        }, this.interval);
    }

    async connect(url: string) {
        const res = await this.sendThreadMsg({
            type: "DMQ_CONNECT",
            url: url
        });
        return res;
    }

    async publish(options: PublishOptions) {
        const promises = [];
        if(!options.trunkSize){
            options.trunkSize = 1000;
        }
        const trunkCnt = Math.ceil(options.payload.length / options.trunkSize);
        for (let i = 1; i <= trunkCnt; i++){
            const msgid = ++this.dgram.msgid;
            const transportMessage = new models_pb.PublishDgram();
            transportMessage.setSeq(msgid);
            transportMessage.setTrunkid(i);
            transportMessage.setTrunktotal(trunkCnt);
            transportMessage.setTs(Date.now());
            transportMessage.setRequest(options.ack || false);
            transportMessage.setTopic(options.topic);
            transportMessage.setAckList(this.dgram.ack);
            transportMessage.setPayload(options.payload.subarray((i - 1) * options.trunkSize, i * options.trunkSize));
            const buf = transportMessage.serializeBinary();

            const p =  this.sendDgramMsg({
                type: options.ack ? "DMQ_REQUEST" : "DMQ_REPORT",
                msgid,
                buf,
                timeout: 5000,
            }, msgid);
            promises.push(p)
        }
        return Promise.all(promises);
    }

    async subscribe(options: SubscribeOptions){
        this.topics.push(options.topic);
        const msgid = ++this.quic.msgid;
        const subscribeMessage = new models_pb.SubscribeMsg()
        subscribeMessage.setTopic(options.topic);
        const upstreamMsg = new models_pb.UpstreamMsg()
        upstreamMsg.setSeq(msgid)
        upstreamMsg.setType("SUBSCRIBE")
        upstreamMsg.setPayload( subscribeMessage.serializeBinary())
        const buf = upstreamMsg.serializeBinary()
        const res = await this.sendQuicMsg({
            type: "DMQ_QUIC_REQUEST",
            msgid,
            buf,
            timeout: 5000,
        } as QuicMessage, msgid)
        return res;
    }
}

export default DMQClient