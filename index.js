import init, { sync_state, counter, generate_tx, send_tx } from './counter_wasm.js'
init().then(() => {
    self.postMessage({ type: 'init' })
    self.onmessage = async (e) => {
        switch (e.data.action) {
            case "sync":
                try {
                    await sync_state()
                    self.postMessage({ type: "synced", mesg: `Synced!` })
                } catch (e) {
                    self.postMessage({ type: 'mesg', mesg: e.toString() })
                }
                break
            case "read":
                const count = counter()
                self.postMessage({ type: "read", mesg: `count: ${count}` })
                break
            case "prov":
                const start = performance.now()
                const tx = generate_tx()
                const end = performance.now()
                console.log(`tx generated. cost ${end - start} ms`)
                self.postMessage({ type: "prov", tx })
                break
            case "send":
                await send_tx(e.data.sendTx)
                self.postMessage({ type: "sent", mesg: `tx sent.` })
                break
            case "stop":
                self.postMessage({ type: 'mesg', mesg: "stopped" })
                break
        }
    }
})