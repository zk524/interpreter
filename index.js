import init, { sync_state, counter, generate_tx, send_tx } from './counter_wasm.js'
init().then(() => {
    self.on_tips = (mesg) => self.postMessage({ type: 'mesg', mesg })
    self.on_progress = (a, b) => self.postMessage({ type: 'prog', a, b })
    self.postMessage({ type: 'init' })
    self.onmessage = async (e) => {
        switch (e.data.action) {
            case "sync":
                try {
                    await sync_state()
                    self.postMessage({ type: "synced", mesg: `Synced!` })
                } catch (e) {
                    self.postMessage({ type: 'synced', mesg: `Error: ${e.toString()}` })
                }
                break
            case "read":
                try {
                    const count = counter()
                    self.postMessage({ type: "read", mesg: `Count: ${count}` })
                } catch {
                    self.postMessage({ type: "read", mesg: `Read failed.` })
                }
                break
            case "prov":
                try {
                    const start = performance.now()
                    const tx = generate_tx()
                    const end = performance.now()
                    self.postMessage({ type: "prov", tx, mesg: `Proved! Cost time: ${(end - start).toFixed(4)} ms` })
                } catch {
                    self.postMessage({ type: "prov", tx: "", mesg: `Prove failed.` })
                }
                break
            case "send":
                try {
                    await send_tx(e.data.tx)
                    self.postMessage({ type: "sent", mesg: `TX has been sent.` })
                } catch {
                    self.postMessage({ type: "sent", mesg: `Sent failed.` })
                }
                break
        }
    }
})