import { TCPServer, TCPEvents, ITCPEventConnect, ITCPEventError, ITCPEventListening } from "../../src/mod.ts";

const server = new TCPServer();

server.events.on(TCPEvents.LISTENING, (event: ITCPEventListening) => {
    console.log(`Listening on ${event.address.host}:${event.address.port}`);
});

server.events.on(TCPEvents.ERROR, (event: ITCPEventError) => {
    console.log(event.error);
});

server.events.on(TCPEvents.CONNECT, (event: ITCPEventConnect) => {
    event.client.events.on(TCPEvents.RECEIVED_DATA, (data: Uint8Array) => {
        console.log('Received:', new TextDecoder().decode(data as Uint8Array));
    });

    event.client.events.on(TCPEvents.DISCONNECT, () => {
        console.log('Client disconnected');
    });

    event.client.write(new TextEncoder().encode("Hello World"));

    console.log(`Client connected: ${event.client.remoteAddr?.hostname}`);
});

for (const port of [7000, 7001, 7002]) {
    if (!server.listen('127.0.0.1', port))
        Deno.exit(1);
}


server.start();