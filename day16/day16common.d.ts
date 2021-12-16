export interface Packet {
    readonly version: number;
    readonly type: number;
    readonly value: bigint;
    readonly subPackets: Packet[];
}

export interface Bitstream {
    buffer: Buffer;
    address: number;
}

export function parseInput(path: string): Packet;
export function printPacket(packet: Packet): string;
