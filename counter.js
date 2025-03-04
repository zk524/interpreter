import init, { sync_state, counter, generate_tx, send_tx } from './counter_wasm.js'
init().then(() => {
    self.postMessage({ type: 'init' })
    self.onmessage = async (e) => {
        switch (e.data.action) {
            case "fire":
                try {
                    await sync_state()
                    const count = counter()
                    console.log(count)
                    const startTime = performance.now()
                    const tx = generate_tx()
                    console.log(performance.now() - startTime)
                    await send_tx(tx)
                    // self.postMessage({ type: "stop", mesg: `${endTime - startTime} ms` })
                    self.postMessage({ type: "stop", mesg: `Successfully` })
                } catch (e) {
                    self.postMessage({ type: 'stop', mesg: e.toString() })
                }
                break
            case "stop":
                self.postMessage({ type: 'stop', mesg: "stopped" })
                break
        }
    }
})