import { EventEmitter } from "../util/emitter.ts";

/**
 * UDP Handler (not fully implemented yet)
 * @unstable using new UDP API, yet to be vetted. More info at: https://doc.deno.land/deno/unstable/~/Deno.DatagramConn
 */
export class UDPHandler {
    private listeners : Deno.DatagramConn[] = [];

    public events : EventEmitter = new EventEmitter();

    /**
     * Binds the server to the given host and port
     * @param host
     * @param port
     * @returns True if the server was successfully bound, false otherwise
     */
    listen(host: string, port: number) : boolean {
        try {
            this.listeners.push(
                Deno.listenDatagram({
                    hostname: host,
                    port: port,
                    transport: "udp"
                })
            );

            this.events.emit("listening", { host, port });
            return true;
        } catch(error) {
            this.events.emit("error", error);
            return false;
        }
    }

    private async _poll(listener: Deno.DatagramConn) {
        for await (const [buf, from] of listener) {
            this.events.emit("data", { buf, from, listener });
        }
    }

    poll() {
        this.listeners.forEach(this._poll.bind(this));
    }
}