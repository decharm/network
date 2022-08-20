```ts
import { TCPClient, TCPEvents } from "../mod.ts";

// Create a new TCP client
const client = new TCPClient();

// Sets up the connected listener to the server
client.events.on(TCPEvents.CONNECT, async () => {
    console.log("Connected");
    
    // Send "Hello world" to the server
    await client.write(new TextEncoder().encode("Hello world"));
});

// Sets up the data listener to the server
client.events.on(TCPEvents.RECEIVED_DATA, (buffer: Uint8Array) => {
    console.log(new TextDecoder().decode(buffer));
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