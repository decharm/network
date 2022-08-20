import { EventEmitter } from "../src/mod.ts";

const emitter = new EventEmitter();

emitter.on("message", (message: string) => {
    console.log(message);
});

emitter.emit("message", "Hello world!");