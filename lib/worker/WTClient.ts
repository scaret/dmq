import {WebTransport, WebTransportBidirectionalStream} from "./WebTransport";
import {DatagramDownstreamMessage, QuicDownstreamMessage} from "../MsgWorkerToMain";

class WTClient {
    public transport?: WebTransport;
    public dgramWriter?: WritableStreamDefaultWriter;
    public quic: {
        stream?: WebTransportBidirectionalStream,
        writer?: WritableStreamDefaultWriter,
    } = {};
    public onmessage?: (msg: DatagramDownstreamMessage|QuicDownstreamMessage) => any

    async connect(url: string) {
        console.log(`Connecting to ${url}`)
        for (let i = 1; i < 20; i++) {
            try {
                this.transport = new WebTransport(url);
                await this.transport.ready;
                break;
            } catch (e) {
                console.error(`#${i} Failed to connect to ${url}`)
                delete this.transport;
            }
        }
        if (this.transport) {
            console.log(`Connected to ${url}`)
        } else {
            throw new Error('connect failed');
        }
        this.dgramWriter = this.transport.datagrams.writable.getWriter();
        this.quic.stream = await this.transport.createBidirectionalStream();
        this.quic.writer = this.quic.stream.writable.getWriter();
        this.startReadDgrams();
        this.startReadQuic();
    }

    private async startReadDgrams() {
        if (!this.transport) {
            throw new Error('No this.transport');
        }
        var reader = this.transport.datagrams.readable.getReader();
        while (true) {
            const {value, done} = await reader.read();
            let now = Date.now();
            if (done) {
                console.log('Done reading datagrams!');
                return;
            }
            if (this.onmessage) {
                this.onmessage({
                    type: 'DMQ_DOWNSTREAM',
                    buf: value,
                    T4: Date.now()
                })
            }
        }
    }


    private async startReadQuic() {
        if (!this.quic.stream) {
            throw new Error('No this.quic.stream');
        }
        var reader = this.quic.stream.readable.getReader();
        while (true) {
            const {value, done} = await reader.read();
            // console.log("QUIC MSG", value)
            let now = Date.now();
            if (done) {
                console.log('Done reading quic!');
                return;
            }
            if (this.onmessage) {
                this.onmessage({
                    type: 'DMQ_QUIC_DOWNSTREAM',
                    buf: value,
                    T4: now
                })
            }
        }
    }
}

export default WTClient