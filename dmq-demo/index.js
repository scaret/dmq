const main = async ()=>{
    const client = new DMQ.DMQClient({worker: true});
    await client.connect("https://ip-127-0-0-1.wrtc.dev:4434/counter")
    console.log("success");
    const u8int = new Uint8Array([1,2,3]);
    client.publish({
        topic: "topic",
        message: "message",
        ack: false,
    }).then((result)=>{
        console.log("Publish result #1", result);
    });
    await new Promise((res, rej)=> setTimeout(res, 1000));
    client.publish({
        topic: "topic",
        message: "message",
        ack: true,
    }).then((result)=>{
        console.log("Publish result #2", result);
    });
    client.publish({
        topic: "topic",
        message: "message",
        ack: false,
    }).then((result)=>{
        console.log("Publish result #3", result);
    });
    await new Promise((res, rej)=> setTimeout(res, 1000));
    client.publish({
        topic: "topic",
        message: "message",
        ack: true,
    }).then((result)=>{
        console.log("Publish result #4", result);
    });
}
main();
