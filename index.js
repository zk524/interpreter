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
                    self.postMessage({ type: "synced", mesg: `Synced!` })
                } catch (e) {
                    self.postMessage({ type: 'mesg', mesg: `Error: ${e.toString()}` })
                }
                break
            case "read":
                try {
                    self.postMessage({ type: "read", mesg: `Count: ${read_state()}` })
                } catch {
                    self.postMessage({ type: "mesg", mesg: `Read failed.` })
                }
                break
            case "prov":
                try {
                    self.postMessage({ type: "prov", data: generate_tx(), mesg: `Finished.` })
                } catch(e) {
                    self.postMessage({ type: "mesg", data: "", mesg: `Prove failed.` })
                }
                break
            case "send":
                try {
                    const count = Number(read_state())
                    self.postMessage({ type: "mesg", mesg: `count will change from ${count} to ${count + 1}` })
                    await send_tx(e.data.data)
                    self.postMessage({ type: "sent", mesg: `TX has been sent.` })
                } catch {
                    self.postMessage({ type: "mesg", mesg: `Sent failed.` })
                }
                break
            case "dump":
                try {
                    self.postMessage({ type: "dump", data: dump_state() })
                } catch {
                    self.postMessage({ type: "mesg", mesg: `Dump failed.` })
                }
                break
            case "rest":
                try {
                    rest_state(e.data.data)
                    self.postMessage({ type: "rest", mesg: "State has been rest." })
                } catch {
                    self.postMessage({ type: "mesg", mesg: `Rest failed.` })
                }
                break
            case "pump":
                try {
                    set_contract_circuit_wasm(e.data.data)
                    self.postMessage({ type: "pump", mesg: "Pumped." })
                } catch {
                    self.postMessage({ type: "pump", mesg: `pump failed.` })
                }
                break
            case "test":
                try {
                    const result = verify_tx_wasm(e.data.data)
                    self.postMessage({ type: "test", mesg: result ? "Verified." : "Invalid tx.", result })
                } catch {
                    self.postMessage({ type: "mesg", mesg: "Verified failed" })
                }
                break
        }
    }
})