// package: 
// file: models.proto

import * as jspb from "google-protobuf";

export class PublishDgram extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

  hasTrunkid(): boolean;
  clearTrunkid(): void;
  getTrunkid(): number | undefined;
  setTrunkid(value: number): void;

  hasTrunktotal(): boolean;
  clearTrunktotal(): void;
  getTrunktotal(): number | undefined;
  setTrunktotal(value: number): void;

  hasTs(): boolean;
  clearTs(): void;
  getTs(): number | undefined;
  setTs(value: number): void;

  hasRequest(): boolean;
  clearRequest(): void;
  getRequest(): boolean | undefined;
  setRequest(value: boolean): void;

  hasTopic(): boolean;
  clearTopic(): void;
  getTopic(): string | undefined;
  setTopic(value: string): void;

  clearAckList(): void;
  getAckList(): Array<number>;
  setAckList(value: Array<number>): void;
  addAck(value: number, index?: number): number;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublishDgram.AsObject;
  static toObject(includeInstance: boolean, msg: PublishDgram): PublishDgram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublishDgram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishDgram;
  static deserializeBinaryFromReader(message: PublishDgram, reader: jspb.BinaryReader): PublishDgram;
}

export namespace PublishDgram {
  export type AsObject = {
    seq?: number,
    trunkid?: number,
    trunktotal?: number,
    ts?: number,
    request?: boolean,
    topic?: string,
    ackList: Array<number>,
    payload: Uint8Array | string,
  }
}

export class DownstreamDgram extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

  hasType(): boolean;
  clearType(): void;
  getType(): string | undefined;
  setType(value: string): void;

  hasT2(): boolean;
  clearT2(): void;
  getT2(): number | undefined;
  setT2(value: number): void;

  hasT3(): boolean;
  clearT3(): void;
  getT3(): number | undefined;
  setT3(value: number): void;

  hasRespondto(): boolean;
  clearRespondto(): void;
  getRespondto(): number | undefined;
  setRespondto(value: number): void;

  clearAckList(): void;
  getAckList(): Array<number>;
  setAckList(value: Array<number>): void;
  addAck(value: number, index?: number): number;

  clearAckt2List(): void;
  getAckt2List(): Array<number>;
  setAckt2List(value: Array<number>): void;
  addAckt2(value: number, index?: number): number;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DownstreamDgram.AsObject;
  static toObject(includeInstance: boolean, msg: DownstreamDgram): DownstreamDgram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DownstreamDgram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DownstreamDgram;
  static deserializeBinaryFromReader(message: DownstreamDgram, reader: jspb.BinaryReader): DownstreamDgram;
}

export namespace DownstreamDgram {
  export type AsObject = {
    seq?: number,
    type?: string,
    t2?: number,
    t3?: number,
    respondto?: number,
    ackList: Array<number>,
    ackt2List: Array<number>,
    payload: Uint8Array | string,
  }
}

export class Delivery extends jspb.Message {
  hasTopic(): boolean;
  clearTopic(): void;
  getTopic(): string | undefined;
  setTopic(value: string): void;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Delivery.AsObject;
  static toObject(includeInstance: boolean, msg: Delivery): Delivery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Delivery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Delivery;
  static deserializeBinaryFromReader(message: Delivery, reader: jspb.BinaryReader): Delivery;
}

export namespace Delivery {
  export type AsObject = {
    topic?: string,
    payload: Uint8Array | string,
  }
}

export class UpstreamMsg extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

  hasType(): boolean;
  clearType(): void;
  getType(): string | undefined;
  setType(value: string): void;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpstreamMsg.AsObject;
  static toObject(includeInstance: boolean, msg: UpstreamMsg): UpstreamMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpstreamMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpstreamMsg;
  static deserializeBinaryFromReader(message: UpstreamMsg, reader: jspb.BinaryReader): UpstreamMsg;
}

export namespace UpstreamMsg {
  export type AsObject = {
    seq?: number,
    type?: string,
    payload: Uint8Array | string,
  }
}

export class SubscribeMsg extends jspb.Message {
  hasTopic(): boolean;
  clearTopic(): void;
  getTopic(): string | undefined;
  setTopic(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeMsg.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeMsg): SubscribeMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeMsg;
  static deserializeBinaryFromReader(message: SubscribeMsg, reader: jspb.BinaryReader): SubscribeMsg;
}

export namespace SubscribeMsg {
  export type AsObject = {
    topic?: string,
  }
}

export class UnsubscribeMsg extends jspb.Message {
  hasTopic(): boolean;
  clearTopic(): void;
  getTopic(): string | undefined;
  setTopic(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnsubscribeMsg.AsObject;
  static toObject(includeInstance: boolean, msg: UnsubscribeMsg): UnsubscribeMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnsubscribeMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnsubscribeMsg;
  static deserializeBinaryFromReader(message: UnsubscribeMsg, reader: jspb.BinaryReader): UnsubscribeMsg;
}

export namespace UnsubscribeMsg {
  export type AsObject = {
    topic?: string,
  }
}

export class DownstreamMsg extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

  hasT2(): boolean;
  clearT2(): void;
  getT2(): number | undefined;
  setT2(value: number): void;

  hasRespondto(): boolean;
  clearRespondto(): void;
  getRespondto(): number | undefined;
  setRespondto(value: number): void;

  hasType(): boolean;
  clearType(): void;
  getType(): string | undefined;
  setType(value: string): void;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DownstreamMsg.AsObject;
  static toObject(includeInstance: boolean, msg: DownstreamMsg): DownstreamMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DownstreamMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DownstreamMsg;
  static deserializeBinaryFromReader(message: DownstreamMsg, reader: jspb.BinaryReader): DownstreamMsg;
}

export namespace DownstreamMsg {
  export type AsObject = {
    seq?: number,
    t2?: number,
    respondto?: number,
    type?: string,
    payload: Uint8Array | string,
  }
}

