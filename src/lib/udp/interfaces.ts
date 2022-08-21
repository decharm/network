/**
 * Interfaces doesn't have IUDPEventClose because there's nothing to receive
 */

/**
 * Interface used on event error callback.
 */
export interface IUDPEventError {
    error : Error;
}

/**
 * Interface used on event data callback.
 */
export interface IUDPEventData {
    data : Uint8Array;
    from : Deno.NetAddr;
}

/**
 * Interface used on event listening callback.
 */
export interface IUDPEventListening {
    address: {
        host: string;
        port: number;
    }
}