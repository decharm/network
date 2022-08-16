import { Packet } from "../mod.ts";

const p = new Packet();

p.writeUTF("Hello World");

console.log(new TextDecoder().decode(p.buffer));