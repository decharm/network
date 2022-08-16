// deno-lint-ignore-file no-explicit-any
export class EventEmitter {
    private listeners: Map<string, ((...args: any)=>void)[]> = new Map();
    
    on(event: string, fn: (...args: any)=>void) {
        this.listeners.set(event, this.listeners.get(event) || []);
        this.listeners.get(event)?.push(fn);
    }

    off(event: string, fn: (...args: any)=>void) {
        const listeners = this.listeners.get(event);

        if (listeners) {
            this.listeners.set(
                event,
                listeners.filter(listener => listener !== fn)
            );
        }
    }

    once(event: string, fn: (...args: any)=>void) {
        const listener = (...args: any) => {
            fn(...args);
            this.off(event, listener);
        }

        this.on(event, listener);
    }

    emit<T>(event: string, data: any[T]) {
        this.listeners.get(event)?.forEach(fn => fn(data));
    }
}