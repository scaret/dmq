const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

let dmqClient = null;
let protobufRoot = null;

$("#connect-btn").on("click", ()=>{
    if (dmqClient){
        console.error("已创建客户端")
        return;
    }
    const worker = $("#worker").val() === "yes";
    const url = $("#broker-url").val()
    dmqClient = new DMQ.DMQClient({worker});
    $("#connect-result").val("CONNECTETING")
    dmqClient.connect(url).then((result)=>{
        console.log("connected", result);
        handleClientConnect(dmqClient)
        $("#connect-result").text("CONNECTED")
        $(".container-connected").show()
    }).catch((e)=>{
        console.error(e)
        $("#connect-result").text("DISCONNECTED")
        dmqClient = null
        $(".container-connected").hide()
    })
})

setTimeout(async ()=>{
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    mediaDevices.forEach((device)=>{
        if (device.kind === "videoinput"){
            $('#cameraid').append(`<option value="${device.deviceId}">${device.label}</option>`)
        }
    })
})

let i = 0;
$("#pub-btn").on("click", async ()=>{
    const topic = $("#pub-topic").val();
    const init = {
        output: async (chunk, encodeConfig)=>{
            // console.log("publish chunk #", i, chunk)
            const data = new Uint8Array(chunk.byteLength);
            chunk.copyTo(data)
            // console.log("chunk", chunk);
            const trunk = {
                type: chunk.type,
                timestamp: chunk.timestamp,
                duration: chunk.duration,
                data: data,
            }
            let config = null
            if (chunk.type === "key"){
                console.log("publish encodeConfig", encodeConfig);
                config = Object.assign({}, encodeConfig.decoderConfig);
                config.description = new Uint8Array(encodeConfig.decoderConfig.description)
                publishConfig = config
            }

            const u8Arr = protobufRoot.lookupType("VideoMessage").encode({trunk, config}).finish();
            const publishOptions = {
                topic: topic,
                payload: u8Arr,
            }
            const result = await dmqClient.publish(publishOptions)
        },
        error: (e)=>{
            console.error(e);
        }
    }

    setInterval(()=>{
        dmqClient.publish({
            topic: 'user-publish-keepalive',
            payload: textEncoder.encode(JSON.stringify({topic: $("#pub-topic").val()})),
        })
    }, 5000);


    const mediaStream = await navigator.mediaDevices.getUserMedia({video: {
            width: 640,
            height: 480,
            frameRate: 15,
            deviceId: $("#cameraid").val(),
            // width: 1280,
            // height: 720,
            // frameRate: 30,
        }});
    const videoTrack = mediaStream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    console.log("settings", settings);
    const config = {
        codec: "avc1.42001E",
        width: settings.width,
        height: settings.height,
        // framerate: 1,
        // bitrate: 1000000,
        // avc : { format: "annexb" },
        // framerate: fps,
    }
    const encoder = new VideoEncoder(init)
    encoder.configure(config)
    const media_processor = new MediaStreamTrackProcessor(videoTrack);
    const reader = media_processor.readable.getReader();
    while(true){
        const {done, value} = await reader.read()
        i++;
        if (done){
            console.log("done")
            break;
        }
        // console.log("done", done, "value", value);
        if (value){
            encoder.encode(value, {keyFrame: i%5 === 1})
            value.close()
        }
    }
})


$("#sub-btn").on("click", async ()=>{
    const topic = $("#sub-topic").val();
    const result = await dmqClient.subscribe({
        topic,
    })
    $("#sub-topics").append(`<li>${topic}</li>`)
    console.log("Sub result", result)
})

let remoteUsers = {

}

function handleVideoMessage(evt){
    // console.log("on message", evt)
    //.................
    // console.log("topic", evt.topic, "payload", evt.payload)
    const videoMessage = protobufRoot.lookupType("VideoMessage").decode(evt.payload);
    const pbEncodedVideoTrunk = videoMessage.trunk;
    // console.log("pbEncodedVideoTrunk", pbEncodedVideoTrunk);
    const encodedVideoTrunkInit = {
        type: pbEncodedVideoTrunk.type,
        timestamp: pbEncodedVideoTrunk.timestamp,
        duration: pbEncodedVideoTrunk.duration,
        data: pbEncodedVideoTrunk.data
    };
    const encodedVideoTrunk = new EncodedVideoChunk(encodedVideoTrunkInit);
    if (!remoteUsers[evt.topic]){
        console.log("topic", evt.topic);
        remoteUsers[evt.topic] = {
            topic: evt.topic,
            player: new VideoPlayer(document.getElementById("onmessage-container")),
            decoder: new VideoDecoder({
                output: (videoFrame)=>{
                    console.log("onFrameDecoded", videoFrame);
                    remoteUsers[evt.topic].player.drawFrame(videoFrame)
                    videoFrame.close()
                },
                error: e =>{console.error(e)}
            })
        };
    }
    if (videoMessage.config){
        console.log("subscribe Configure", videoMessage.config)
        remoteUsers[evt.topic].decoder.configure(videoMessage.config)
        remoteUsers[evt.topic].player.adjustResolution(videoMessage.config)
        // remoteUsers[evt.topic].decoder.configure(publishConfig)
        // remoteUsers[evt.topic].player.adjustResolution(publishConfig)
    }
    // console.log("Going to deccode encodedVideoTrunk", encodedVideoTrunk);
    remoteUsers[evt.topic].decoder.decode(encodedVideoTrunk);
}

async function handleClientConnect(client){
    if ($("#suball").prop("checked")){
        const userTopic = "user-publish-keepalive";
        const result = await dmqClient.subscribe({
            topic: userTopic,
        })
        $("#sub-topics").append(`<li>${userTopic}</li>`)
        console.log("Sub result", result)
    }

    client.on("message", async (evt)=>{
        if (evt.topic.indexOf("user/") === 0){
            handleVideoMessage(evt)
        }else if (evt.topic === "user-publish-keepalive"){
            const str = textDecoder.decode(evt.payload)
            const topic = JSON.parse(str).topic
            console.log("user-publish-keepalive", topic)
            if (dmqClient && dmqClient.topics.indexOf(topic) === -1){
                const result = await dmqClient.subscribe({
                    topic,
                })
                $("#sub-topics").append(`<li>${topic}</li>`)
                console.log("Sub result", result)
            }
        }else{
            console.log("Unrecognized event", evt);
        }
    })
}


const main = async ()=>{
    const uid = Math.floor(Math.random() * 9000 + 1000)
    $("#pub-topic").val(`user/${uid}`)
    $("#sub-topic").val(`user/${uid}`)
    protobuf.load("./webcodecs-video-chat.proto", ((err, root)=>{
        protobufRoot = root;
        console.log("Loaded protobufRoot", protobufRoot);
    }))
}

main()