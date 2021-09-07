const main = async ()=>{
    const client = new DMQ.DMQClient({worker: true});
    // await client.connect("https://ip-127-0-0-1.wrtc.dev:4434/counter")
    await client.connect("https://localhost.wrtc.dev:4434/counter")
    console.log("success");

    const resArr = [];
    window.resArr = []
    let cnt = 0;
    setInterval(()=>{
        const req = {
            cnt: cnt++,
            now: Date.now(),
            success: null,
            fail: null,
        };
        client.publish({
            topic: "topic",
            message: "message",
            ack: true,
        }).then((result)=>{
            req.success = result;
            resArr.push(req);
            // console.log("Publish Success", resArr);
        }).catch((err)=>{
            // console.log("Publish Error")
            req.fail = err;
            resArr.push(req)
        });
    }, 0)
    setInterval(()=>{
        let total = 0;
        let success = 0;
        let upstreamLoss = 0;
        let downstreamLoss = 0;
        const now = Date.now();
        for (let i = resArr.length - 1; i >= 0; i--){
            const res = resArr[i];
            if (now - res.now > 5000){
                total++;
                if (res.fail){
                    upstreamLoss++;
                }else if (!res.success.T4){
                    downstreamLoss++
                }else{
                    success++
                }
                resArr.splice(i, 1);
            }
        }
        console.log(`Total ${total}, Success ${Math.floor(100 * success / total)}%, upstreamLoss ${Math.floor(100 * upstreamLoss / total)}%, DownstreamLoss ${Math.floor(100 * downstreamLoss / total)}%`)
    }, 2000)
}
