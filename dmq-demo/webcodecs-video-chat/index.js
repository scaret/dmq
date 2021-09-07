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

$("#pub-btn").on("click", async ()=>{
    const topic = $("#pub-topic").val();
    const init = {
        output: async (chunk, config)=>{
            const data = new Uint8Array(chunk.byteLength);
            chunk.copyTo(data)
            // console.log("chunk", chunk);
            const payload = {
                type: chunk.type,
                timestamp: chunk.timestamp,
                duration: chunk.duration,
                data: data,
            }
            const u8Arr = protobufRoot.lookupType("EncodedVideoTrunk").encode(payload).finish();
            const publishOptions = {
                topic: topic,
                payload: u8Arr,
                ack: true,
            }
            const result = await dmqClient.publish(publishOptions)
            console.log("publish result", result);
        },
        error: (e)=>{
            console.error(e);
        }
    }


    const mediaStream = await navigator.mediaDevices.getUserMedia({video: {
            width: 640,
            height: 480,
            frameRate: 15,
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
        if (done){
            console.log("done")
            break;
        }
        // console.log("done", done, "value", value);
        if (value){
            encoder.encode(value)
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

function handleClientConnect(client){
    client.on("message", (evt)=>{
        console.log("topic", evt.topic, "payload", evt.payload)
        const now = new Date()
        switch($("#showType").val()){
            case "text":
                $("#message-list").prepend(`\n${now.toISOString()} ${textDecoder.decode(evt.payload)}`)
                break;
            case "buflen":
                $("#message-list").prepend(`\n${now.toISOString()} payload len: ${evt.payload.length}`)
                break;
        }
    })
}


const main = async ()=>{
    const uid = Math.floor(Math.random() * 9000 + 1000)
    $("#pub-topic").val(`user/${uid}`)
    protobuf.load("./webcodecs-video-chat.proto", ((err, root)=>{
        protobufRoot = root;
        console.log("Loaded protobufRoot", protobufRoot);
    }))
}

main()