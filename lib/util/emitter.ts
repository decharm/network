// deno-lint-ignore-file no-explicit-any

/**
 * Event emitter
 */
export class EventEmitter {
    private listeners: Map<string, ((...args: any)=>void)[]> = new Map();
    
    /**
     * Adds a listener to the event
     * @param event 
     * @param fn 
     */
    on(event: string, fn: (...args: any)=>void) {
        this.listeners.set(event, this.listeners.get(event) || []);
        this.listeners.get(event)?.push(fn);
    }

    /**
     * Removes a listener from the event
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
     * Adds a one-time listener to the event
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
     * Emits an event
     * @param event 
     * @param data 
     */
    emit(event: string, ...data: any[]) {
        this.listeners.get(event)?.forEach(fn => fn(...data));
    }
}