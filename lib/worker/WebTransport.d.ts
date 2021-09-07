export class WebTransport {
    constructor(url: string);

    readonly ready: Promise<undefined>;
    datagrams: WebTransportDatagramDuplexStream;

    createBidirectionalStream() : Promise<WebTransportBidirectionalStream>
}

export interface WebTransportBidirectionalStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
}

export interface WebTransportDatagramDuplexStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
    readonly maxDatagramSize: number;
    incomingMaxAge?: number;
    outgoingMaxAge?: number;
    incomingHighWaterMark: number;
    outgoingHighWaterMark: number;
}