export interface ThreadControlMessage{
    // 以下主线程填写
    type: 'DMQ_CONNECT'|'DMQ_DISCONNECT';
    url: string;
}

export interface ThreadControlAckMessage{
    // 以下Worker填写
    type: 'DMQ_CONNECT_SUCCESS'|'DMQ_CONNECT_FAIL';
    success: boolean;
}

export interface DatagramSignalSent{
    type: 'DMQ_DATAGRAM_SIGNAL_SENT';
    T1: number;
    msgid: number;
}

export interface DatagramMessage{
    // 以下主线程填写
    type: 'DMQ_REQUEST'|'DMQ_REPORT';
    msgid: number;
    buf: ArrayBuffer;
    timeout: number;

    // 以下Worker发送后填写
    T1?: number; // 发送的时间戳
    datagramSize?: number; //发送的包大小
    resolve?: (data: any)=>any;
    reject?: (data: any)=>any

    // 以下Worker收到消息后填写
    T2?: number; // 服务端接收的时间戳；需要时钟同步；需要把request置为true
    T3?: number; // Worker收到ACK消息的时间戳；统计时应只统计有T2的消息。
    response?: ArrayBuffer;
}

export interface DatagramDownstreamMessage{
    // 以下主线程填写
    type: 'DMQ_DOWNSTREAM';
    buf: Uint8Array;
    T4: number;
}