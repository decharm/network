import { UDPConnection, UDPEvents, IUDPEventListening, IUDPEventData, IUDPEventError } from "../../src/mod.ts";

const handler = new UDPConnection();

handler.events.on(UDPEvents.LISTENING, (event: IUDPEventListening) => {
    console.log(event.address);
    handler.write(new TextEncoder().encode("Ping"), {
        hostname: "127.0.0.1",
        port: 8080,
        transport: "udp"
    });
});

handler.events.on(UDPEvents.ERROR, (event: IUDPEventError) => {
    console.log(event.error);
});

handler.events.on(UDPEvents.RECEIVED_DATA, (event: IUDPEventData) => {
    console.log(new TextDecoder().decode(event.data));
});

handler.listen("127.0.0.1", 8081);
handler.poll();