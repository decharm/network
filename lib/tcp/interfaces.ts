/**
 * Interfaces doesn't have IEventDisconnect because there's nothing to receive
 */
import { TCPClient } from "./client.ts";

/**
 * Interface used on event error callback.
 */
export interface IEventError {
    error : Error;
}

/**
 * Interface used on event connected callback.
 */
export interface IEventConnect {
    client : TCPClient;
}

/**
 * Interface used on event disconnected callback.
 */
export interface IEventData {
    data : Uint8Array;
}

/**
 * Interface used on event listening callback.
 */
export interface IEventListening {
    address: {
        host: string;
        port: number;
    }
}