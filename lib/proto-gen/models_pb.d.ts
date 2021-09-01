// package: 
// file: models.proto

import * as jspb from "google-protobuf";

export class PublishDgram extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

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
    ts?: number,
    request?: boolean,
    topic?: string,
    ackList: Array<number>,
    payload: Uint8Array | string,
  }
}

export class PublishAckDgram extends jspb.Message {
  hasSeq(): boolean;
  clearSeq(): void;
  getSeq(): number | undefined;
  setSeq(value: number): void;

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
  toObject(includeInstance?: boolean): PublishAckDgram.AsObject;
  static toObject(includeInstance: boolean, msg: PublishAckDgram): PublishAckDgram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublishAckDgram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishAckDgram;
  static deserializeBinaryFromReader(message: PublishAckDgram, reader: jspb.BinaryReader): PublishAckDgram;
}

export namespace PublishAckDgram {
  export type AsObject = {
    seq?: number,
    t2?: number,
    t3?: number,
    respondto?: number,
    ackList: Array<number>,
    ackt2List: Array<number>,
    payload: Uint8Array | string,
  }
}

