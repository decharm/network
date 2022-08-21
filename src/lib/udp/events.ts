/**
 * A static class that aims to enumerate events available to UDP listeners.
 */
export class UDPEvents {
    /**
     * Event emitted when the listener is listening.
     * @EventEmitter callback signature: ({ address: { host: string, port: number }}) => void
     * @param address - The address the listener is listening on.
     */
    public static readonly LISTENING = "listening";

    /**
     * Event emitted when the listener receives data.
     * @EventEmitter callback signature: ({ data: Uint8Array, from: Deno.NetAddr }) => void
     * @param data - The data that was received.
     * @param from - The address the data was received from.
     */
    public static readonly RECEIVED_DATA = "data";

    /**
     * Event emitted when an error occurs.
     * @EventEmitter callback signature: ({ error: Error }) => void
     * @param error - The error that occurred.
     */
    public static readonly ERROR = "error";

    /**
     * Event emitted when the listener is closed.
     * @EventEmitter callback signature: () => void
     */
    public static readonly CLOSED = "closed";
}