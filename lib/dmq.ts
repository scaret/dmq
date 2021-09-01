import models_pb from "./proto-gen/models_pb"
import WorkerAgent from "./worker"
import {
    DatagramDownstreamMessage,
    DatagramMessage,
    DatagramSignalSent,
    ThreadControlAckMessage,
    ThreadControlMessage
} from "./Message";
import {PublishOptions, PublishResult} from "./interface";

interface DMQClientOptions{
    worker: boolean;
    timeoutInterval?: number;
    dgramTimeout?: number;
}

interface MsgReq{
    msgid?: number;
    type?: string;
    T1?: number;
    resolve: (data: any)=>any
    reject: (err: any)=>any
}

class DMQClient{
    worker: Worker|WorkerAgent;
    interval: number;
    thread: {
        pendingReqs: MsgReq[],
    } = {pendingReqs: []}
    control: {
    } = {}
    dgram: {
        msgid: number;
        pendingReqs: MsgReq[],
        ack: number[],//粗暴
    } = {msgid: 0, pendingReqs: [], ack: []}
    private timer?: ReturnType<typeof setInterval>;
    private timeout: number;
    constructor(options: DMQClientOptions) {
        if (options.worker){
           this.worker = new Worker(new URL('./worker.ts', import.meta.url));
        }
        else{
            this.worker = new WorkerAgent();
        }
        this.interval = options.timeoutInterval || 1000
        this.timeout = options.dgramTimeout || 3000
        this.startTimeoutChecker()
        this.worker.onmessage = (evt: { data: ThreadControlAckMessage|DatagramDownstreamMessage|DatagramSignalSent})=>{
            // console.log("onmessage", evt.data);
            if (evt.data.type === "DMQ_CONNECT_SUCCESS" || evt.data.type === "DMQ_CONNECT_FAIL"){
                const index = this.thread.pendingReqs.findIndex((msg) => msg.type === "DMQ_CONNECT");
                if (index === -1){
                    console.error(`Unexpected Response`, this.thread.pendingReqs);
                    return;
                }
                const req = this.thread.pendingReqs[index];
                this.thread.pendingReqs.splice(index, 1);
                evt.data.type === "DMQ_CONNECT_SUCCESS" ? req.resolve(evt.data) : req.reject(evt.data)
            }else if (evt.data.type === "DMQ_DATAGRAM_SIGNAL_SENT"){
                const signalSent = evt.data as DatagramSignalSent;
                const msgReq = this.dgram.pendingReqs.find((req)=>req.msgid === signalSent.msgid);
                if (msgReq){
                    msgReq.T1 = signalSent.T1;
                }
            }else if (evt.data.type === "DMQ_DOWNSTREAM"){
                const downstreamMessage = evt.data as DatagramDownstreamMessage
                const pbMsgDown = models_pb.PublishAckDgram.deserializeBinary(downstreamMessage.buf);
                this.dgram.ack = ([] as number[]).concat(pbMsgDown.getAckList())
                const respondTo = pbMsgDown.getRespondto()
                pbMsgDown.getAckList().forEach((ack: number, index)=>{
                    const i = this.dgram.pendingReqs.findIndex((req)=>req.msgid === ack);
                    const msgReq = this.dgram.pendingReqs[i];
                    if (!msgReq){
                        return;
                    }
                    this.dgram.pendingReqs.splice(i, 1);
                    const publishRes:PublishResult = {
                        T1: msgReq.T1,
                        T2: pbMsgDown.getAckt2List()[index],
                    }
                    msgReq.resolve(publishRes);
                });
                if (respondTo){
                    this.dgram.ack.push(respondTo);
                    const i = this.dgram.pendingReqs.findIndex((req)=>req.msgid === respondTo);
                    if (i < 0){
                        // console.error(`Res not found`, respondTo, i);
                    }else{
                        const msgReq = this.dgram.pendingReqs[i];
                        this.dgram.pendingReqs.splice(i, 1);
                        const publishRes:PublishResult = {
                            T1: msgReq.T1,
                            T2: pbMsgDown.getT2(),
                            T4: downstreamMessage.T4
                        }
                        msgReq.resolve(publishRes);
                    }
                }
            }
        }
    }
    private async sendThreadMsg(message: ThreadControlMessage, timeout = 5000){
        return new Promise((resolve, reject)=>{
           this.thread.pendingReqs.push({
               type: 'DMQ_CONNECT',
               resolve,
               reject
           });
           this.worker.postMessage(message)
        });
    }
    private async sendDgramMsg(message: DatagramMessage, msgid: number, timeout = 5000){
        return new Promise((resolve, reject)=>{
            this.dgram.pendingReqs.push({
                msgid: msgid,
                type: message.type,
                resolve,
                reject
            });
            this.worker.postMessage(message)
        });
    }
    private startTimeoutChecker(){
        if (this.timer){
            clearInterval(this.timer);
        }
        this.timer = setInterval(()=>{
            const now = Date.now();
            for (let i = this.dgram.pendingReqs.length - 1; i >=0; i--){
                let req = this.dgram.pendingReqs[i];
                if (req.T1 && now - req.T1 > this.timeout){
                    this.dgram.pendingReqs.splice(i, 1);
                    req.reject(new Error("TIMEOUT"));
                }
            }
        }, this.interval);
    }
    async connect(url: string){
        const res = await this.sendThreadMsg({
            type: "DMQ_CONNECT",
            url: url
        });
        return res;
    }
    async publish(options: PublishOptions){
        const msgid = ++this.dgram.msgid;
        const transportMessage= new models_pb.PublishDgram();
        transportMessage.setSeq(msgid);
        transportMessage.setTs(Date.now());
        transportMessage.setRequest(options.ack || false);
        transportMessage.setTopic(options.topic);
        transportMessage.setAckList(this.dgram.ack);
        transportMessage.setPayload(options.payload);
        const buf = transportMessage.serializeBinary();

        const res = await this.sendDgramMsg({
            type: options.ack ? "DMQ_REQUEST" : "DMQ_REPORT",
            msgid,
            buf,
            timeout: 5000,
        }, msgid);
        return res;
    }
}

export {
    DMQClient
}