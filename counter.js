import init, { sync_state, counter, generate_tx, send_tx } from './counter_wasm.js'
init().then(() => {
    self.postMessage({ type: 'init' })
    self.onmessage = function (e) {
        switch (e.data.action) {
            case "fire":
                try {
                    const startTime = performance.now()
                    const result = sync_state()
                    const endTime = performance.now()
                    self.postMessage({ type: "stop", mesg: `${endTime - startTime} ms` })
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