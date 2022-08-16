import { EventEmitter } from "../util/emitter.ts";
import { TCPClient } from "./client.ts";

export class TCPServer {
    private listeners : Deno.Listener[] = [];
    
    public events : EventEmitter = new EventEmitter();
    public clients : TCPClient[] = [];

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

    start() {
        this.listeners.forEach(this.accept.bind(this));
    }
}