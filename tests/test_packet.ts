import { Packet } from "../src/mod.ts";

const p = new Packet();

p.writeByte(65);
p.writeShort(901);
p.writeInt(7930221);
p.writeBoolean(true);

p.writeUTF("Hello World");

p.writeObject({
    bool: true,
    str: "Hello World",
    num: 7930221,
    f: () => {},
    obj: {
        bool: true,
    }
});

/**
 * Run tests
 */
if (p.buffer.length != 76) {
    throw new Error(`Packet.buffer.length expected to be 76, instead it is ${p.buffer.length}.`);
} else {
    console.log("Packet length is correct");
}

const expected : Map<() => unknown, unknown> = new Map();

expected.set(p.readByte.bind(p), 65);
expected.set(p.readShort.bind(p), 901);
expected.set(p.readInt.bind(p), 7930221);
expected.set(p.readBoolean.bind(p), true);
expected.set(p.readUTF.bind(p), "Hello World");

for (const [key, value] of expected) {
    const actual = key();
    if (actual !== value) {
        throw new Error(`Packet.[${key.name}] expected ${value} but got ${actual}.`);
    } else {
        console.log(`Packet.[${key.name}] is correct`);
    }
}

console.log(p.readObject());