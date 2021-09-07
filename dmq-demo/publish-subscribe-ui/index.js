const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

let dmqClient = null;

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
    const payload = textEncoder.encode($("#pub-payload").val());
    const result = await dmqClient.publish({
        topic,
        payload,
        ack: true,
    })
    console.log("Pub result", result);
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
    const client = new DMQ.DMQClient({worker: false});
    await client.connect("https://ip-127-0-0-1.wrtc.dev:4434/counter")
    console.log("success");
    client.on("message", (evt)=>{
        console.log("topic", evt.topic, "payload", textDecoder.decode(evt.payload), "evt", evt);
    })

    const result1 = await client.publish({
        topic: "abc",
        payload: textEncoder.encode("自己收不到"),
        ack: true,
    });
    console.log("#1 Publish result", result1);
    const result2 = await client.subscribe({
        topic: "abc"
    });
    console.log("#2 Subscribe result", result2);
    const result3 = await client.publish({
        topic: "abc",
        payload: textEncoder.encode("自己收得到"),
        ack: true,
    });
    console.log("#3 Publish result", result3);
    await new Promise((res, rej)=> setTimeout(res, 1000));
}