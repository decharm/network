export class Packet {
    private bytes : Array<number>;

    constructor(bytes : Uint8Array | undefined = undefined) {
        this.bytes = bytes ? Array.from(bytes) : [];
    }

    writeByte(value : number) : void {
        if (!Number.isInteger(value))
            throw new Error("Value must be an integer");

        this.bytes.push(value & 0xFF);
    }

    writeShort(value : number) : void {
        this.bytes.push(value & 0xFF);
        this.bytes.push((value >> 8) & 0xFF);
    }

    writeInt(value : number) : void {
        this.bytes.push((value >> 24) & 0xFF);
        this.bytes.push((value >> 16) & 0xFF);
        this.bytes.push((value >> 8) & 0xFF);
        this.bytes.push(value & 0xFF);
    }

    writeUTF(value : string) : void {
        const bytes = new TextEncoder().encode(value);
        this.writeShort(bytes.length);
        this.bytes.push(...bytes);
    }

    get buffer() : Uint8Array {
        return new Uint8Array(this.bytes);
    }
}