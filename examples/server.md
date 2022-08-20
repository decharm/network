```ts
import { IEventConnect, IEventError, IEventListening } from "../lib/tcp/interfaces.ts";
import { TCPServer, TCPEvents } from "../mod.ts";

// Create a server
const server = new TCPServer();

// Add a listener for the listening event
server.events.on(TCPEvents.LISTENING, (event: IEventListening) => {
    console.log(`Listening on ${event.address.host}:${event.address.port}`);
});

// Add a listener for the error event
server.events.on(TCPEvents.ERROR, (event: IEventError) => {
    console.log(event.error);
});

// Add a listener for the connect event
server.events.on(TCPEvents.CONNECT, (event: IEventConnect) => {
    // Add a listener for the data event dispatched by the client
    event.client.events.on(TCPEvents.RECEIVED_DATA, (data: Uint8Array) => {
        console.log('Received:', new TextDecoder().decode(data as Uint8Array));
    });

    // Add a listener for the disconnect event dispatched by the client
    event.client.events.on(TCPEvents.DISCONNECT, () => {
        console.log('Client disconnected');
    });

    // Send "Hello world" to the client
    event.client.write(new TextEncoder().encode("Hello World"));

    console.log(`Client connected: ${event.client.remoteAddr?.hostname}`);
});

// Listen multiple ports
for (const port of [7000, 7001, 7002]) {
    // .listen returns a boolean indicating whether the port was successfully bound
    if (!server.listen('127.0.0.1', port))
        // If the port was not bound, exit the program [error event will be automatically dispatched]
        Deno.exit(1);
}

// Start accepting connections
server.start();
```