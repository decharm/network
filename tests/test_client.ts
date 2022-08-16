import { TCPClient } from "../mod.ts";

const client = new TCPClient();

client.events.on("connected", async () => {
    console.log("Connected");
    
    await client.write(new TextEncoder().encode("Hello world"));
});

client.events.on("data", (buffer: Uint8Array) => {
    console.log(new TextDecoder().decode(buffer));
});

client.events.on("disconnected", () => {
    console.log("disconnected");
});

await client.connect("127.0.0.1", 7000);

client.poll();