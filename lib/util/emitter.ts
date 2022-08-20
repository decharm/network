// deno-lint-ignore-file no-explicit-any

/**
 * Event Emitter is a simple event class with the sole purpose of being lightweight and easy to use. It only provides 4 basic methods.
 */
export class EventEmitter {
    private listeners: Map<string, ((...args: any)=>void)[]> = new Map();
    
    /**
     * Sets up a function that will be called whenever the specified event is delivered to the target.
     * @param event 
     * @param fn 
     */
    on(event: string, fn: (...args: any)=>void) {
        this.listeners.set(event, this.listeners.get(event) || []);
        this.listeners.get(event)?.push(fn);
    }

    /**
     * Removes an event listener previously registered with EventEmitter.on (once is not removed) from the target.
     * @param event
     * @param fn
     */
    off(event: string, fn: (...args: any)=>void) {
        const listeners = this.listeners.get(event);

        if (listeners) {
            this.listeners.set(
                event,
                listeners.filter(listener => listener !== fn)
            );
        }
    }

    /**
     * Sets up a function that will be called only once when the specified event is delivered to the destination.
     * @param event 
     * @param fn 
     */
    once(event: string, fn: (...args: any)=>void) {
        const listener = (...args: any) => {
            fn(...args);
            this.off(event, listener);
        }

        this.on(event, listener);
    }

    /**
     * Sends a call to each function registered for the given event, passing all remaining parameters of this method to the function.
     * @param event - The event to emit.
     * @param data - The data to send to the event listeners. [rest operator]
     */
    emit(event: string, ...data: any[]) {
        this.listeners.get(event)?.forEach(fn => fn(...data));
    }
}