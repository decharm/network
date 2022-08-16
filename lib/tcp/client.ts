import { EventEmitter } from "../util/emitter.ts";
import { iterateReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";

export class TCPClient {
    private connection: Deno.Conn | null = null;
    public events : EventEmitter = new EventEmitter();
    private isConnected = false;

    constructor(connection : Deno.Conn | null = null) {
        if (connection) {
            this.connection = connection;
            this.isConnected = true;
        }
    }

    get remoteAddr() : Deno.NetAddr | null {
        return this.connection?.remoteAddr as Deno.NetAddr;
    }

    get localAddr() : Deno.NetAddr | null {
        return this.connection?.localAddr as Deno.NetAddr;
    }

    get connected() : boolean {
        return this.isConnected;
    }

    close() {
        if (this.connection) {
            this.isConnected = false;
            this.connection.close();
        }
    }

    async connect(host: string, port: number) {
        try {
            this.connection = await Deno.connect({ hostname: host, port: port, transport: "tcp" });
            this.isConnected = true;
            this.events.emit("connected");
        } catch (error) {
            this.events.emit(error);
        }
    }

    async write(data: Uint8Array) {
        if (this.connection) {
            await this.connection.write(data);
        }
    }

    async poll() {
        if (this.connection) {
            try {
                for await (const buffer of iterateReader(this.connection, { bufSize: 1024! })) {
                    this.events.emit("data", buffer);
                }
            } catch(error) {
                this.events.emit("error", error);
            }

            this.close();
            this.events.emit("disconnected");
        }
    }
}