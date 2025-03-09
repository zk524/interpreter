import init, { sync_state, sync_state_2, read_state, generate_tx, send_tx, dump_state, rest_state, verify_tx, set_contract_circuit_wasm } from './counter_wasm.js'
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
            case "syn2":
                try {
                    await sync_state_2()
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
                    const data = e.data.data
                    if (!data) return
                    const data_strip = data.startsWith("0x") ? data.slice(2) : data
                    const tx = new Uint8Array(data_strip.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
                    await send_tx(tx)
                    self.postMessage({ type: "sent" })
                } catch (e) {
                    self.postMessage({ type: "mesg", mesg: e })
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
            case "code":
                try {
                    set_contract_circuit_wasm(e.data.data)
                } catch { }
                finally {
                    self.postMessage({ type: "code" })

                }
                break
            case "test":
                try {
                    verify_tx(e.data.data)
                    self.postMessage({ type: "test" })
                } catch {
                    self.postMessage({ type: "mesg" })
                }
                break
        }
    }
})