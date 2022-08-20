### Client
```ts
import { TCPClient, TCPEvents, IEventData } from "../src/mod.ts";

// Create a new TCP client
const client = new TCPClient();

// Sets up the connected listener to the server
client.events.on(TCPEvents.CONNECT, async () => {
    console.log("Connected");
    
    // Send "Hello world" to the server
    await client.write(new TextEncoder().encode("Hello world"));
});

// Sets up the data listener to the server
client.events.on(TCPEvents.RECEIVED_DATA, (event: IEventData) => {
    console.log(
        new TextDecoder().decode(event.data)
    );
});

// Sets up the disconnected listener to the server
client.events.on(TCPEvents.DISCONNECT, () => {
    console.log("disconnected");
});

// Connect to the server
await client.connect("127.0.0.1", 7000);

// Start polling the server for data
client.poll();
```

### Server
```ts
import { TCPServer, TCPEvents, IEventConnect, IEventError, IEventListening } from "../src/mod.ts";

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