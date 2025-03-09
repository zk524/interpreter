import init, { sync_state, read_state, generate_tx, send_tx, dump_state, rest_state, set_contract_circuit_wasm, verify_tx_wasm } from './counter_wasm.js'
init().then(() => {
    self.on_tips = (mesg) => self.postMessage({ type: 'mesg', mesg })
    self.on_progress = (a, b) => self.postMessage({ type: 'prog', a, b })
    self.postMessage({ type: 'init' })
    self.onmessage = async (e) => {
        switch (e.data.action) {
            case "sync":
                try {
                    await sync_state()
                    self.postMessage({ type: "synced" })
                } catch {
                    self.postMessage({ type: 'mesg' })
                }
                break
            case "read":
                try {
                    self.postMessage({ type: "read", mesg: `Count: ${read_state()}` })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
            case "prov":
                try {
                    self.postMessage({ type: "prov", data: generate_tx() })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
            case "send":
                try {
                    const count = Number(read_state())
                    self.postMessage({ type: "mesg", mesg: `Count will change from ${count} to ${count + 1}` })
                    await send_tx(e.data.data)
                    self.postMessage({ type: "sent" })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
            case "dump":
                try {
                    self.postMessage({ type: "dump", data: dump_state() })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
            case "rest":
                try {
                    rest_state(e.data.data)
                    self.postMessage({ type: "rest" })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
            case "pump":
                try {
                    set_contract_circuit_wasm(e.data.data)
                } catch { }
                finally {
                    self.postMessage({ type: "pump" })

                }
                break
            case "test":
                try {
                    verify_tx_wasm(e.data.data)
                    self.postMessage({ type: "test" })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
        }
    }
})