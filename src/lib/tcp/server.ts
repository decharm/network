import { EventEmitter } from "../util/emitter.ts";
import { TCPClient } from "./client.ts";

/**
 * TCP server
 */
export class TCPServer {
    private listeners : Deno.Listener[] = [];
    
    public events : EventEmitter = new EventEmitter();
    public clients : TCPClient[] = [];

    /**
     * Binds the server to the given host and port
     * @param host
     * @param port
     * @returns True if the server was successfully bound, false otherwise
     */
    listen(host: string, port: number) : boolean {
        try {
            this.listeners.push(
                Deno.listen({
                    hostname: host,
                    port: port,
                    transport: "tcp"
                })
            );

            this.events.emit("listening", { host, port });
            return true;
        } catch(error) {
            this.events.emit("error", error);
            return false;
        }
    }

    private async accept(listener: Deno.Listener) {
        for await (const conn of listener) {
            const client = new TCPClient(conn);
            
            this.clients.push(client);

            this.events.emit("connected", client);
            client.poll();
        }
    }

    /**
     * Closes the server
     */
    close() {
        this.listeners.forEach(listener => listener.close());
    }

    /**
     * Starts the server
     */
    start() {
        this.listeners.forEach(this.accept.bind(this));
    }
}