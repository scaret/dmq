import WTClient from "./WTClient";
import {DatagramMessage, QuicMessage, ThreadControlMessage} from "../MsgMainToWorker";
import {
    DatagramDownstreamMessage,
    ThreadControlAckMessage,
    DatagramSignalSent,
    QuicSignalSent, QuicDownstreamMessage
} from "../MsgWorkerToMain";

class WorkerAgent {
    workerThread?: any;
    wtClient: WTClient;
    pendingMsgs: DatagramMessage[] = [];
    pendingQuicMsgs: QuicMessage[] = [];
    public onmessage?: (e: any) => any;

    constructor(workerThread?: Window) {
        this.wtClient = new WTClient()
        this.wtClient.onmessage = (msg ) => {
            this.sendMessageToMainThread(msg)
        }
        if (workerThread) {
            this.workerThread = workerThread;
            workerThread.onmessage = (evt) => {
                this.handleMessage(evt.data);
            }
        }
    }

    private async handleMessage(data: ThreadControlMessage | DatagramMessage | QuicMessage) {
        if (data.type === 'DMQ_CONNECT') {
            try {
                await this.connect(data.url)
                this.sendMessageToMainThread({
                    type: 'DMQ_CONNECT_SUCCESS',
                    success: true,
                })
            } catch (e) {
                this.sendMessageToMainThread({
                    type: 'DMQ_CONNECT_FAIL',
                    success: false,
                })
            }
        }
        if (data.type === 'DMQ_REQUEST' || data.type === 'DMQ_REPORT') {
            this.publish(data as DatagramMessage);
        }
        if (data.type === "DMQ_QUIC_REQUEST"){
            this.sendQuicMsg(data as QuicMessage)
        }
    }

    //主线程调用，向子线程发消息
    postMessage(data: ThreadControlMessage | DatagramMessage | QuicMessage) {
        this.handleMessage(data);
    }

    //子线程调用，向主线程发送消息
    sendMessageToMainThread(data: ThreadControlAckMessage | DatagramDownstreamMessage | DatagramSignalSent | QuicDownstreamMessage| QuicSignalSent) {
        // in a worker
        if (this.workerThread) {
            this.workerThread.postMessage(data);
        }
        // inline
        if (this.onmessage) {
            this.onmessage({data})
        }
    }

    private async connect(url: string) {
        if (!this.wtClient.transport) {
            await this.wtClient.connect(url);
        }
    }

    private async publish(msg: DatagramMessage) {
        return new Promise(async (resolve, reject) => {
            msg.resolve = resolve;
            msg.reject = reject;
            this.pendingMsgs.push(msg);
            if (!this.wtClient.transport || !this.wtClient.dgramWriter) {
                throw new Error('No transport');
            }
            try {
                const T1 = Date.now();
                await this.wtClient.dgramWriter.write(msg.buf)
                this.sendMessageToMainThread({
                    type: "DMQ_DATAGRAM_SIGNAL_SENT",
                    msgid: msg.msgid,
                    T1,
                } as DatagramSignalSent)
            } catch (e) {
                console.error(e);
            }
        });
    }

    private async sendQuicMsg(msg: QuicMessage) {
        return new Promise(async (resolve, reject) => {
            msg.resolve = resolve;
            msg.reject = reject;
            this.pendingQuicMsgs.push(msg);
            if (!this.wtClient.transport || !this.wtClient.quic.writer) {
                throw new Error('No transport');
            }
            try {
                const T1 = Date.now();
                await this.wtClient.quic.writer.write(msg.buf)
                this.sendMessageToMainThread({
                    type: "DMQ_QUIC_SIGNAL_SENT",
                    msgid: msg.msgid,
                    T1,
                } as QuicSignalSent)
            } catch (e) {
                console.error(e);
            }
        });
    }
}

if (typeof self !== "undefined" && !self.document) {
    // I'm in a worker
    const defaultWorkerAgent = new WorkerAgent(self);
}

export default WorkerAgent