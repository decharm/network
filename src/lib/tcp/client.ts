import { iterateReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import { EventEmitter } from "../util/emitter.ts";

/**
 * TCP client
 */
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

    /**
     * Get remote address
     */
    get remoteAddr() : Deno.NetAddr | null {
        return this.connection?.remoteAddr as Deno.NetAddr;
    }

    /**
     * Get local address
     */
    get localAddr() : Deno.NetAddr | null {
        return this.connection?.localAddr as Deno.NetAddr;
    }

    /**
     * Checks if the client is connected to the server
     */
    get connected() : boolean {
        return this.isConnected;
    }

    /**
     * Closes the connection
     */
    close() {
        if (this.connection) {
            this.isConnected = false;
            this.connection.close();
        }
    }

    /**
     * Connects to the server
     * @param host 
     * @param port 
     */
    async connect(host: string, port: number) {
        try {
            this.connection = await Deno.connect({ hostname: host, port: port, transport: "tcp" });
            this.isConnected = true;
            this.events.emit("connected");
        } catch (error) {
            this.events.emit(error);
        }
    }

    /**
     * Sends data to the server
     * @param data 
     */
    async write(data: Uint8Array) {
        if (this.connection) {
            await this.connection.write(data);
        }
    }

    /**
     * Starts listening for data from the server
     */
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