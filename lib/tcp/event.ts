/**
 * A static class that aims to enumerate events available to TCP servers and clients.
 */
export class TCPEvents {
    /**
     * Emitted when a client connects to the server.
     * @EventEmitter callback signature: (client: TCPClient) => void
     * @param client The client that connected.
     */
    public static readonly CONNECT = "connected";
    /**
     * Emitted when a client disconnects from the server.
     * @EventEmitter callback signature: () => void
     */
    public static readonly DISCONNECT = "disconnected";
    /**
     * Emitted when an error occurs.
     * @EventEmitter callback signature: (error: Error) => void
     * @param error The error that occurred.
     */
    public static readonly ERROR = "error";
    /**
     * Emitted when the client receives data.
     * @EventEmitter callback signature: (data: Uint8Array) => void
     * @param data The data that was received.
     */
    public static readonly RECEIVED_DATA = "data";
    /**
     * Emitted when the server is listening for connections.
     * @EventEmitter callback signature: ({host: string, port: number}) => void
     * @param address - The address the server is listening on.
     */
    public static readonly LISTENING = "listening";
}