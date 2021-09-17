const main = async ()=>{
    const client = new DMQ.DMQClient({worker: true});
    // await client.connect("https://ip-127-0-0-1.wrtc.dev:4434/counter")
    await client.connect("https://localhost.wrtc.dev:4434/counter")
    console.log("success");

    const resArr = [];
    window.resArr = []
    let cnt = 0;
    let targetPacketSentPerSecond = 500
    let packetsSent = {} //{sec: number, cnt: number} 只用于计算每次应该发多少包
    setInterval(()=>{
        const ms = Date.now();
        const sec = Math.floor(ms / 1000)
        let packetSendTotal = 0;
        //补发三秒钟之内的包
        let currentItem = null
        for (let historySec = sec - 6; historySec <= sec; historySec++){
            let historyItem = packetsSent[historySec];
            if (!historyItem){
                historyItem = {sec: historySec, cnt: 0}
                packetsSent[historySec] = historyItem
            }
            if (sec - historyItem.sec === 0){
                currentItem = historyItem
            }else if (sec - historyItem.sec > 0){
                if (targetPacketSentPerSecond - historyItem.cnt > 0){
                    packetSendTotal += targetPacketSentPerSecond - historyItem.cnt;
                    historyItem.cnt = targetPacketSentPerSecond
                }
            }
        }
        if (!currentItem){
            currentItem = {sec, cnt: 0}
            packetsSent[sec] = currentItem
        }
        const num = Math.floor((ms / 1000 - sec) * targetPacketSentPerSecond - currentItem.cnt)
        currentItem.cnt += num
        packetSendTotal += num;
        for (let i = 0; i < packetSendTotal; i++){
            const req = {
                cnt: cnt++,
                now: Date.now(),
                success: null,
                fail: null,
            };
            client.publish({
                topic: "topic",
                payload: new Uint8Array([1,2,3]),
                ack: true,
            }).then((result)=>{
                req.success = result;
                resArr.push(req);
                // console.log("Publish Success", result);
            }).catch((err)=>{
                console.log("Publish Error", err)
                req.fail = err;
                resArr.push(req)
            });
        }
    }, 0)
    setInterval(()=>{
        let total = 0;
        let success = 0;
        let loss = 0
        const now = Date.now();
        for (let i = resArr.length - 1; i >= 0; i--){
            const res = resArr[i];
            if (now - res.now > 5000){
                total++;
                if (res.success && res.success[0] && res.success[0].T2){
                    success++
                }else{
                    loss++
                }
                resArr.splice(i, 1);
            }
        }
        console.log(`Total ${total}, Success ${Math.floor(100 * success / total)}%, loss ${Math.floor(100 * loss / total)}%`)
    }, 2000)
}
