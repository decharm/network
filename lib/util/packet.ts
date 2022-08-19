/**
 * Packet is a structured string of bytes that serves to facilitate communication between client and server.
 */
export class Packet {
    private bytes : Array<number>;
    private cachedBuffer : Uint8Array | undefined;

    /**
     * Creates a new Packet.
     * @param bytes The bytes to initialize the Packet with. [optional]
     */
    constructor(bytes : Uint8Array | undefined = undefined) {
        this.bytes = bytes ? Array.from(bytes) : [];
    }

    /**
     * Merges the given Packet into this Packet.
     * @param packet The Packet to merge into this Packet.
     */
     merge(packet : Packet) : void {
        this.bytes.push(...packet.bytes);
    }

    /**
     * Writes a byte to the Packet.
     * @param value The byte to write. [Range: 0-255]
     */
    writeByte(value : number) : void {
        if (!Number.isInteger(value))
            throw new Error("value must be an integer");

        if (value < 0 || value > 255)
            throw new Error("value must be between 0 and 255");

        this.bytes.push(value & 0xFF);
    }

    /**
     * Writes a short to the Packet.
     * @param value The short to write. [Range: -32768-32767]
     */
    writeShort(value : number) : void {
        this.bytes.push((value >> 8) & 0xFF);
        this.bytes.push(value & 0xFF);
    }

    /**
     * Writes an int to the Packet.
     * @param value The int to write. [Range: -2147483648-2147483647]
     */
    writeInt(value : number) : void {
        this.bytes.push((value >> 24) & 0xFF);
        this.bytes.push((value >> 16) & 0xFF);
        this.bytes.push((value >> 8) & 0xFF);
        this.bytes.push(value & 0xFF);
    }

    /**
     * Writes a boolean to the Packet.
     * @param value The boolean to write.
     */
    writeBoolean(value : boolean) : void {
        this.writeByte(value ? 1 : 0);
    }

    /**
     * Writes a UTF string to the Packet.
     * @param value The UTF string to write.
     */
    writeUTF(value : string) : void {
        const bytes = new TextEncoder().encode(value);
        this.writeShort(bytes.length);
        this.bytes.push(...bytes);
    }

    /**
     * Deep serializes the given object into a Packet.
     * Only will serialize keys that have value types of number, boolean, string, or object.
     * Also ignores prototype properties.
     * @param object The object to serialize.
     * @param seen 
     */
    writeObject(object : Record<string, unknown>, seen: Set<unknown> = new Set) : void {
        const keys = Object.keys(object);

        this.writeShort(keys.length);

        seen.add(object);

        for (const key of keys) {
            const type = typeof object[key];

            if (type === "string") {
                this.writeUTF(key);
                this.writeByte(0);
                this.writeUTF(object[key] as string);
            } else if (type === "number") {
                this.writeUTF(key);
                this.writeByte(1);
                this.writeInt(object[key] as number);
            } else if (type === "boolean") {
                this.writeUTF(key);
                this.writeByte(2);
                this.writeBoolean(object[key] as boolean);
            } else if (type === "object") {
                if (seen.has(object[key])) {
                    this.writeUTF(key);
                    this.writeByte(0);
                    this.writeUTF("[Circular]");
                } else {
                    this.writeUTF(key);
                    this.writeByte(3);
                    this.writeObject(object[key] as Record<string, unknown>, seen);
                }
            }
        }
    }

    readByte() : number {
        return this.bytes.shift() as number;
    }

    readShort() : number {
        const byte1 = this.readByte();
        const byte2 = this.readByte();
        return (byte1 << 8) | byte2;
    }

    readInt() : number {
        const byte1 = this.readByte();
        const byte2 = this.readByte();
        const byte3 = this.readByte();
        const byte4 = this.readByte();

        return (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4;
    }

    readBoolean() : boolean {
        return this.readByte() === 1;
    }

    readUTF() : string {
        const length = this.readShort();
        const bytes = new Uint8Array(this.bytes.splice(0, length));
        return new TextDecoder().decode(bytes);
    }

    readObject() : Record<string, unknown> {
        const length = this.readShort();
        const object : Record<string, unknown> = {};

        for (let i = 0; i < length; i++) {
            const key = this.readUTF();
            const type = this.readByte();
            if (type === 0) {
                object[key] = this.readUTF();
            } else if (type === 1) {
                object[key] = this.readInt();
            } else if (type === 2) {
                object[key] = this.readBoolean();
            } else if (type === 3) {
                object[key] = this.readObject();
            }
        }
        return object;
    }

    [Symbol.iterator]() : Iterator<number> {
        return this.bytes[Symbol.iterator]();
    }

    /**
     * Gets the bytes of the Packet.
     * @returns The bytes of the Packet as a Uint8Array.
     */
    get buffer() : Uint8Array {
        if (!this.cachedBuffer || this.cachedBuffer.length !== this.bytes.length) {
            this.cachedBuffer = new Uint8Array(this.bytes);
        }
        
        return this.cachedBuffer;
    }
}