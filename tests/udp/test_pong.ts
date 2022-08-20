import { UDPHandler } from "../../src/mod.ts";

const handler = new UDPHandler();

handler.events.on("listening", (data) => {
    console.log(data);
});

handler.events.on("error", (error) => {
    console.log(error);
});

handler.listen("127.0.0.1", 8080);

handler.poll();