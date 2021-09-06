export interface ThreadControlAckMessage {
    // 以下Worker填写
    type: 'DMQ_CONNECT_SUCCESS' | 'DMQ_CONNECT_FAIL';
    success: boolean;
}

export interface DatagramSignalSent {
    type: 'DMQ_DATAGRAM_SIGNAL_SENT';
    T1: number;
    msgid: number;
}

export interface DatagramDownstreamMessage {
    // 以下主线程填写
    type: 'DMQ_DOWNSTREAM';
    buf: Uint8Array;
    T4: number;
}