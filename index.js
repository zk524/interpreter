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
                    self.postMessage({ type: 'mesg', mesg: `Error: ${e.toString()}` })
                }
                break
            case "read":
                const count = counter()
                self.postMessage({ type: "read", mesg: `Count: ${count}` })
                break
            case "prov":
                const start = performance.now()
                const tx = generate_tx()
                const end = performance.now()
                self.postMessage({ type: "prov", tx, mesg: `Proved! Cost time: ${end - start} ms` })
                break
            case "send":
                await send_tx(e.data.tx)
                self.postMessage({ type: "sent", mesg: `TX has been sent.` })
                break
        }
    }
})