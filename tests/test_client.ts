import { TCPClient, TCPEvents } from "../mod.ts";

const client = new TCPClient();

client.events.on(TCPEvents.CONNECT, async () => {
    console.log("Connected");
    
    await client.write(new TextEncoder().encode("Hello world"));
});

client.events.on(TCPEvents.RECEIVED_DATA, (buffer: Uint8Array) => {
    console.log(new TextDecoder().decode(buffer));
});

client.events.on(TCPEvents.DISCONNECT, () => {
    console.log("disconnected");
});

await client.connect("127.0.0.1", 7000);

client.poll();