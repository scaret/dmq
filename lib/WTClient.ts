import {WebTransport} from "./WebTransport";
import {DatagramDownstreamMessage} from "./Message";

class WTClient{
    public transport?: WebTransport;
    public dgramWriter?: WritableStreamDefaultWriter;
    public onmessage?: (msg: DatagramDownstreamMessage)=>any
    async connect (url: string){
        console.log(`Connecting to ${url}`)
        for (let i = 1; i < 20; i++){
            try{
                this.transport = new WebTransport(url);
                await this.transport.ready;
                break;
            }catch(e){
                console.error(`#${i} Failed to connect to ${url}`)
                delete this.transport;
            }
        }
        if (this.transport){
            console.log(`Connected to ${url}`)
        }else{
            throw new Error('connect failed');
        }
        this.dgramWriter = this.transport.datagrams.writable.getWriter();
        this.startReadDgrams();
    }
    async startReadDgrams(){
        if (!this.transport){
            throw new Error('No this.transport');
        }
        var reader = this.transport.datagrams.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            let now = Date.now();
            if (done) {
                console.log('Done reading datagrams!');
                return;
            }
            if (this.onmessage){
                this.onmessage({
                    type: 'DMQ_DOWNSTREAM',
                    buf: value,
                    T4: Date.now()
                })
            }
        }
    }
}

export default WTClient