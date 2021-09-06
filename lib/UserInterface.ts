export interface PublishOptions {
    topic: string;
    payload: Uint8Array | string;
    /**
     * 需不需要服务端立刻发出确认消息
     */
    ack?: boolean;
}

export interface PublishResult {
    /**
     * 客户端发送请求的时间戳
     */
    T1?: number;
    /**
     * 服务端接收请求的（服务端的）时间戳
     */
    T2?: number;
    /**
     * 服务端发出请求的时间戳，暂时留空。
     */
    T3?: number;
    /**
     * 客户端接收请求的时间戳，仅当 PublishOptions.ack 为true时有（不然服务端不会立即返回）
     */
    T4?: number;
}

export interface DMQClientOptions {
    worker: boolean;
    timeoutInterval?: number;
    dgramTimeout?: number;
}