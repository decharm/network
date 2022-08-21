import { EventEmitter } from "../util/emitter.ts";

/**
 * @unstable using new UDP API, yet to be vetted. More info at: https://doc.deno.land/deno/unstable/~/Deno.DatagramConn
 */
export class UDPConnection {
    private listener : Deno.DatagramConn | undefined;
    public events : EventEmitter = new EventEmitter();

    constructor(listener: Deno.DatagramConn | undefined = undefined) {
        if (listener) {
            this.listener = listener;
        }
    }

    /**
     * Binds the server to the given host and port
     * @param host
     * @param port
     * @returns True if the server was successfully bound, false otherwise
     */
    listen(host: string, port: number) : boolean {
        try {
            if (!this.listener) {
                this.listener = Deno.listenDatagram({
                    hostname: host,
                    port: port,
                    transport: "udp"
                })

                this.events.emit("listening", { address: { host, port } });
                return true;
            }

            
            return false;
        } catch(error) {
            this.events.emit("error", error);
            return false;
        }
    }

    /**
     * Polls the listener for new data
     * @param once Whether to poll once or continuously
     */
    async poll(once = false) {
        if (!this.listener)
            return;

        for await (const [data, from] of this.listener) {
            this.events.emit("data", { data, from });

            if (once)
                break;
        }
    
        this.close();
        this.events.emit("closed");
    }

    /**
     * Sends data to the given address
     * @param buffer The data to send
     * @param to The address to send the data to
     * @returns Number of bytes sent
     */
    async write(buffer: Uint8Array, to: Deno.NetAddr) : Promise<number> {
        if (!this.listener)
            return 0;

        return await this.listener.send(buffer, to);
    }

    /**
     * Closes the listener
     */
    close() {
        if (!this.listener)
            return;

        this.listener.close();
        this.listener = undefined;
    }

    /**
     * Gets the address of the listener
     */
    get addr() : Deno.NetAddr | null {
        return this.listener?.addr as Deno.NetAddr;
    }
}