// source: models.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.PublishAckDgram', null, global);
goog.exportSymbol('proto.PublishDgram', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PublishDgram = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PublishDgram.repeatedFields_, null);
};
goog.inherits(proto.PublishDgram, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PublishDgram.displayName = 'proto.PublishDgram';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PublishAckDgram = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PublishAckDgram.repeatedFields_, null);
};
goog.inherits(proto.PublishAckDgram, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PublishAckDgram.displayName = 'proto.PublishAckDgram';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PublishDgram.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PublishDgram.prototype.toObject = function(opt_includeInstance) {
  return proto.PublishDgram.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PublishDgram} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PublishDgram.toObject = function(includeInstance, msg) {
  var f, obj = {
    seq: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
    ts: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
    request: (f = jspb.Message.getBooleanField(msg, 3)) == null ? undefined : f,
    topic: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
    ackList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f,
    payload: msg.getPayload_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PublishDgram}
 */
proto.PublishDgram.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PublishDgram;
  return proto.PublishDgram.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PublishDgram} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PublishDgram}
 */
proto.PublishDgram.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSeq(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTs(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRequest(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setTopic(value);
      break;
    case 5:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addAck(values[i]);
      }
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PublishDgram.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PublishDgram.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PublishDgram} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PublishDgram.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeBool(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getAckList();
  if (f.length > 0) {
    writer.writeRepeatedUint32(
      5,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeBytes(
      6,
      f
    );
  }
};


/**
 * required uint32 seq = 1;
 * @return {number}
 */
proto.PublishDgram.prototype.getSeq = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setSeq = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearSeq = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishDgram.prototype.hasSeq = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required uint64 ts = 2;
 * @return {number}
 */
proto.PublishDgram.prototype.getTs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setTs = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearTs = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishDgram.prototype.hasTs = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional bool request = 3;
 * @return {boolean}
 */
proto.PublishDgram.prototype.getRequest = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setRequest = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearRequest = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishDgram.prototype.hasRequest = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * required string topic = 4;
 * @return {string}
 */
proto.PublishDgram.prototype.getTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setTopic = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearTopic = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishDgram.prototype.hasTopic = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated uint32 ack = 5;
 * @return {!Array<number>}
 */
proto.PublishDgram.prototype.getAckList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setAckList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.addAck = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearAckList = function() {
  return this.setAckList([]);
};


/**
 * required bytes payload = 6;
 * @return {!(string|Uint8Array)}
 */
proto.PublishDgram.prototype.getPayload = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * required bytes payload = 6;
 * This is a type-conversion wrapper around `getPayload()`
 * @return {string}
 */
proto.PublishDgram.prototype.getPayload_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPayload()));
};


/**
 * required bytes payload = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPayload()`
 * @return {!Uint8Array}
 */
proto.PublishDgram.prototype.getPayload_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPayload()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.setPayload = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishDgram} returns this
 */
proto.PublishDgram.prototype.clearPayload = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishDgram.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PublishAckDgram.repeatedFields_ = [5,6];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PublishAckDgram.prototype.toObject = function(opt_includeInstance) {
  return proto.PublishAckDgram.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PublishAckDgram} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PublishAckDgram.toObject = function(includeInstance, msg) {
  var f, obj = {
    seq: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
    t2: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
    t3: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
    respondto: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
    ackList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f,
    ackt2List: (f = jspb.Message.getRepeatedField(msg, 6)) == null ? undefined : f,
    payload: msg.getPayload_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PublishAckDgram}
 */
proto.PublishAckDgram.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PublishAckDgram;
  return proto.PublishAckDgram.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PublishAckDgram} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PublishAckDgram}
 */
proto.PublishAckDgram.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSeq(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setT2(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setT3(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setRespondto(value);
      break;
    case 5:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addAck(values[i]);
      }
      break;
    case 6:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint64() : [reader.readUint64()]);
      for (var i = 0; i < values.length; i++) {
        msg.addAckt2(values[i]);
      }
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PublishAckDgram.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PublishAckDgram.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PublishAckDgram} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PublishAckDgram.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getAckList();
  if (f.length > 0) {
    writer.writeRepeatedUint32(
      5,
      f
    );
  }
  f = message.getAckt2List();
  if (f.length > 0) {
    writer.writeRepeatedUint64(
      6,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeBytes(
      7,
      f
    );
  }
};


/**
 * required uint32 seq = 1;
 * @return {number}
 */
proto.PublishAckDgram.prototype.getSeq = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setSeq = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearSeq = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishAckDgram.prototype.hasSeq = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required uint64 T2 = 2;
 * @return {number}
 */
proto.PublishAckDgram.prototype.getT2 = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setT2 = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearT2 = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishAckDgram.prototype.hasT2 = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint64 T3 = 3;
 * @return {number}
 */
proto.PublishAckDgram.prototype.getT3 = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setT3 = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearT3 = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishAckDgram.prototype.hasT3 = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional uint32 respondto = 4;
 * @return {number}
 */
proto.PublishAckDgram.prototype.getRespondto = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setRespondto = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearRespondto = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishAckDgram.prototype.hasRespondto = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated uint32 ack = 5;
 * @return {!Array<number>}
 */
proto.PublishAckDgram.prototype.getAckList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setAckList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.addAck = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearAckList = function() {
  return this.setAckList([]);
};


/**
 * repeated uint64 ackT2 = 6;
 * @return {!Array<number>}
 */
proto.PublishAckDgram.prototype.getAckt2List = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setAckt2List = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.addAckt2 = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearAckt2List = function() {
  return this.setAckt2List([]);
};


/**
 * optional bytes payload = 7;
 * @return {!(string|Uint8Array)}
 */
proto.PublishAckDgram.prototype.getPayload = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes payload = 7;
 * This is a type-conversion wrapper around `getPayload()`
 * @return {string}
 */
proto.PublishAckDgram.prototype.getPayload_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPayload()));
};


/**
 * optional bytes payload = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPayload()`
 * @return {!Uint8Array}
 */
proto.PublishAckDgram.prototype.getPayload_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPayload()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.setPayload = function(value) {
  return jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PublishAckDgram} returns this
 */
proto.PublishAckDgram.prototype.clearPayload = function() {
  return jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PublishAckDgram.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 7) != null;
};


goog.object.extend(exports, proto);