import { TCPClient, TCPServer } from "../mod.ts";

const server = new TCPServer();

server.events.on("listening", (data: { host: string, port: number }) => {
    console.log(`Listening on ${data.host}:${data.port}`);
});

server.events.on("error", (error: Error) => {
    console.log(error);
});

server.events.on("connected", (client: TCPClient) => {
    client.events.on("data", (data: Uint8Array) => {
        console.log('Received:', new TextDecoder().decode(data as Uint8Array));
    });

    client.write(new TextEncoder().encode("Hello World"));

    console.log(`Client connected: ${client.remoteAddr?.hostname}`);
});

for (const port of [7000, 7001, 7002]) {
    if (!server.listen('127.0.0.1', port))
        Deno.exit(1);
}


server.start();