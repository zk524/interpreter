import init, { sync_state, counter, generate_tx, send_tx } from './counter_wasm.js'
init().then(() => {
    self.postMessage({ type: 'init' })
    self.onmessage = async (e) => {
        switch (e.data.action) {
            case "fire":
                const startTime = performance.now()
                await sync_state()
                    .then(() => console.log("successfully"))
                    .catch((e) => console.error(e))
                    .finally(() => self.postMessage({ type: "stop", mesg: `${performance.now() - startTime} ms` }))
                break
            case "stop":
                self.postMessage({ type: 'stop', mesg: "stopped" })
                break
        }
    }
})