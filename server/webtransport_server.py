#!/usr/bin/env python3

import argparse
import asyncio
import logging
from collections import defaultdict
from typing import Dict, Optional

from aioquic.asyncio import QuicConnectionProtocol, serve
from aioquic.h3.connection import H3_ALPN, H3Connection
from aioquic.h3.events import H3Event, HeadersReceived, WebTransportStreamDataReceived, DatagramReceived
from aioquic.quic.configuration import QuicConfiguration
from aioquic.quic.connection import stream_is_unidirectional
from aioquic.quic.events import ProtocolNegotiated, StreamReset, QuicEvent

from protogen import models_pb2
import time

BIND_ADDRESS = '0.0.0.0'
BIND_PORT = 4434

logger = logging.getLogger(__name__)


# CounterHandler implements a really simple protocol:
#   - For every incoming bidirectional stream, it counts bytes it receives on
#     that stream until the stream is closed, and then replies with that byte
#     count on the same stream.
#   - For every incoming unidirectional stream, it counts bytes it receives on
#     that stream until the stream is closed, and then replies with that byte
#     count on a new unidirectional stream.
#   - For every incoming datagram, it sends a datagram with the length of
#     datagram that was just received.

userCnt = 0

topics = {
}


class CounterHandler:

    def __init__(self, session_id, http: H3Connection) -> None:
        global userCnt
        self._session_id = session_id
        self._http = http
        self._counters = defaultdict(int)
        self.seq = 0
        self.msgReq = []
        self.msgReqT2 = []
        self.quicSeq = 0
        self.subscribedTopics = []
        userCnt += 1
        self.userid = userCnt

    def h3_event_received(self, event: H3Event) -> None:
        now = round(time.time() * 1000)
        if isinstance(event, DatagramReceived):
            reqMsg = models_pb2.PublishDgram()
            reqMsg.ParseFromString(event.data)
            for ackid in reqMsg.ack:
                try:
                    index = self.msgReq.index(ackid)
                    del self.msgReq[index]
                    del self.msgReqT2[index]
                except:
                    continue
            if reqMsg.request:
                # UDP Publish
                resMsg = models_pb2.DownstreamDgram()
                self.seq += 1
                resMsg.seq = self.seq
                resMsg.type = "ACK"
                resMsg.T2 = now
                resMsg.respondto = reqMsg.seq
                resMsg.ack.extend(self.msgReq)
                resMsg.ackT2.extend(self.msgReqT2)
#                 print("resMsg", resMsg)
                self._http.send_datagram(self._session_id, resMsg.SerializeToString())
            self.msgReq.append(reqMsg.seq)
            self.msgReqT2.append(now)
            # 广播消息
            deliveryMsg = models_pb2.Delivery()
            deliveryMsg.topic = reqMsg.topic
            deliveryMsg.payload = reqMsg.payload
            print("=====Delivery message from #", self.userid ,"on topic", deliveryMsg.topic, "packet" , reqMsg.trunkid, "/" , reqMsg.trunktotal, len(deliveryMsg.payload))
            downstreamMsg = models_pb2.DownstreamDgram()
            downstreamMsg.T2 = now
            downstreamMsg.type = "DELIVERY"
            downstreamMsg.ack.extend(self.msgReq)
            downstreamMsg.ackT2.extend(self.msgReqT2)
            downstreamMsg.payload = deliveryMsg.SerializeToString()

            if reqMsg.topic in topics:
                for user in topics[reqMsg.topic]:
                    user.seq += 1
                    downstreamMsg.seq = user.seq
                    downstreamMsg.ack.extend(user.msgReq)
                    downstreamMsg.ackT2.extend(user.msgReqT2)
                    downstreamMsg.T3 = round(time.time() * 1000)
                    print("DELIVER on topic", reqMsg.topic, "from user #", self.userid ,"to user #" , user.userid, "payload length", len(downstreamMsg.payload))
                    user._http.send_datagram(user._session_id, downstreamMsg.SerializeToString())

        if isinstance(event, WebTransportStreamDataReceived):
            quicReqMsg = models_pb2.UpstreamMsg()
            quicReqMsg.ParseFromString(event.data)
            if quicReqMsg.type == "SUBSCRIBE":
                subscribeMsg = models_pb2.SubscribeMsg()
                subscribeMsg.ParseFromString(quicReqMsg.payload)
                self.subscribedTopics.append(subscribeMsg.topic)
                self.quicSeq += 1
                msgAck = models_pb2.DownstreamMsg()
                msgAck.seq = self.quicSeq
                msgAck.T2 = now
                msgAck.respondto = quicReqMsg.seq
                msgAck.type = "ACK"
                self._http._quic.send_stream_data(event.stream_id, msgAck.SerializeToString(), end_stream=False)
                # 把用户放在topic列表中
                if not subscribeMsg.topic in topics:
                    print("new topic", subscribeMsg.topic)
                    topics[subscribeMsg.topic] = []
                if not self in topics[subscribeMsg.topic]:
                    print("add user #", self.userid, " to topic", subscribeMsg.topic)
                    topics[subscribeMsg.topic].append(self)
    def unsubscribe(self, topic):
        if topic in topics:
            for user in topics[topic]:
                topics[topic].remove(self)

    def stream_closed(self, stream_id: int) -> None:
        # 清除用户的订阅
        for topic in self.subscribedTopics:
            print("delete user #", self.userid, " from topic ", topic)
            self.unsubscribe(topic)

        try:
            del self._counters[stream_id]
        except KeyError:
            pass


# WebTransportProtocol handles the beginning of a WebTransport connection: it
# responses to an extended CONNECT method request, and routes the transport
# events to a relevant handler (in this example, CounterHandler).
class WebTransportProtocol(QuicConnectionProtocol):

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._http: Optional[H3Connection] = None
        self._handler: Optional[CounterHandler] = None

    def quic_event_received(self, event: QuicEvent) -> None:
        if isinstance(event, ProtocolNegotiated):
            self._http = H3Connection(self._quic, enable_webtransport=True)
        elif isinstance(event, StreamReset) and self._handler is not None:
            # Streams in QUIC can be closed in two ways: normal (FIN) and
            # abnormal (resets).  FIN is handled by the handler; the code
            # below handles the resets.
            self._handler.stream_closed(event.stream_id)

        if self._http is not None:
            for h3_event in self._http.handle_event(event):
                self._h3_event_received(h3_event)

    def _h3_event_received(self, event: H3Event) -> None:
        if isinstance(event, HeadersReceived):
            headers = {}
            for header, value in event.headers:
                headers[header] = value
            if (headers.get(b":method") == b"CONNECT" and
                    headers.get(b":protocol") == b"webtransport"):
                self._handshake_webtransport(event.stream_id, headers)
            else:
                self._send_response(event.stream_id, 400, end_stream=True)

        if self._handler:
            self._handler.h3_event_received(event)

    def _handshake_webtransport(self,
                                stream_id: int,
                                request_headers: Dict[bytes, bytes]) -> None:
        authority = request_headers.get(b":authority")
        path = request_headers.get(b":path")
        if authority is None or path is None:
            # `:authority` and `:path` must be provided.
            self._send_response(stream_id, 400, end_stream=True)
            return
        if path == b"/counter":
            assert(self._handler is None)
            self._handler = CounterHandler(stream_id, self._http)
            self._send_response(stream_id, 200)
        else:
            self._send_response(stream_id, 404, end_stream=True)

    def _send_response(self,
                       stream_id: int,
                       status_code: int,
                       end_stream=False) -> None:
        headers = [(b":status", str(status_code).encode())]
        self._http.send_headers(
            stream_id=stream_id, headers=headers, end_stream=end_stream)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('certificate')
    parser.add_argument('key')
    args = parser.parse_args()

    configuration = QuicConfiguration(
        alpn_protocols=H3_ALPN,
        is_client=False,
        max_datagram_frame_size=65536,
    )
    configuration.load_cert_chain(args.certificate, args.key)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        serve(
            BIND_ADDRESS,
            BIND_PORT,
            configuration=configuration,
            create_protocol=WebTransportProtocol,
        ))
    try:
        logging.info(
            "Listening on https://{}:{}".format(BIND_ADDRESS, BIND_PORT))
        loop.run_forever()
    except KeyboardInterrupt:
        pass
