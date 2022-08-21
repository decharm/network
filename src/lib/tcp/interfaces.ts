/**
 * Interfaces doesn't have ITCPEventDisconnect because there's nothing to receive
 */
import { TCPClient } from "./client.ts";

/**
 * Interface used on event error callback.
 */
export interface ITCPEventError {
    error : Error;
}

/**
 * Interface used on event connected callback.
 */
export interface ITCPEventConnect {
    client : TCPClient;
}

/**
 * Interface used on event data callback.
 */
export interface ITCPEventData {
    data : Uint8Array;
}

/**
 * Interface used on event listening callback.
 */
export interface ITCPEventListening {
    address: {
        host: string;
        port: number;
    }
}