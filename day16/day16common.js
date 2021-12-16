const fs = require('fs');

/**
 * Reads an N-bit number from the stream
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} bits
 * @returns {number}
 */
function readNumber(bitstream, bits) {
    if (bits > 16) throw new TypeError(`bit length (bits) of ${ bits } is out of range - must be no more than 16.`);

    // Find the byte where the next bit starts
    const startAddr = Math.floor(bitstream.address / 8);

    // Read a 32-bit window from that start address
    const window = bitstream.buffer.readUInt32BE(startAddr);

    // Extract aligned 16-bit view from window
    const addrOffset = bitstream.address % 8;
    const view = (window >>> (16 - addrOffset)) & 0xFFFF;

    // Update the address
    bitstream.address += bits;

    // Shift view into final alignment
    const neededShift = 16 - bits;
    return view >>> neededShift;
}

/**
 * Reads a variable-length number from the stream
 * @param {import('./day16common.js').Bitstream} bitstream
 * @returns {bigint}
 */
function readVariableNumber(bitstream) {
    let number = 0n;

    while (true) { // eslint-disable-line no-constant-condition
        // Read the next block
        const block = readNumber(bitstream, 5);

        // Extract the part
        const part = BigInt(block & 15);

        // Update the number
        number = (number << 4n) | part;

        // Stop when we get a terminal block
        if ((block & 16) === 0) {
            break;
        }
    }

    return number;
}

/**
 * Reads a sequence of packets, up to the specified total number of bits
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} totalBits
 * @returns {(import('./day16common').Packet)[]}
 */
function parseSubPacketsByBitLength(bitstream, totalBits) {
    const subPackets = [];

    const endAddr = bitstream.address + totalBits;
    while (bitstream.address < endAddr) {
        const packet = parsePacket(bitstream);
        subPackets.push(packet);
    }

    return subPackets;
}

/**
 * Reads a sequence of packets, up to the specified total number of packets
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} totalPackets
 * @returns {(import('./day16common').Packet)[]}
 */
function parseSubPacketsByPacketCount(bitstream, totalPackets) {
    const subPackets = [];

    for (let i = 0; i < totalPackets; i++) {
        const packet = parsePacket(bitstream);
        subPackets.push(packet);
    }

    return subPackets;
}

/**
 * Reads a sequence of sub-packets from the stream
 * @param {import('./day16common.js').Bitstream} bitstream
 * @returns {(import('./day16common').Packet)[]}
 */
function parseSubPackets(bitstream) {
    const lengthType = readNumber(bitstream, 1);

    if (lengthType === 0) {
        const totalBits = readNumber(bitstream, 15);
        return parseSubPacketsByBitLength(bitstream, totalBits);

    } else {
        const totalPackets = readNumber(bitstream, 11);
        return parseSubPacketsByPacketCount(bitstream, totalPackets);
    }
}

/**
 * Parses a sum (type 0) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseSumPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const value = subPackets.reduce((sum, packet) => sum + packet.value, 0n);

    return {
        type: 0,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a product (type 1) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseProductPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const value = subPackets.reduce((sum, packet) => sum * packet.value, 1n);

    return {
        type: 1,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a minimum (type 2) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseMinimumPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const value = subPackets.reduce((sum, packet) => {
        if (sum === null || packet.value < sum) return packet.value;
        return sum;
    }, /** @type {bigint | null }*/(null));

    return {
        type: 2,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a maximum (type 3) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseMaximumPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const value = subPackets.reduce((sum, packet) => {
        if (sum === null || packet.value > sum) return packet.value;
        return sum;
    }, /** @type {bigint | null }*/(null));

    return {
        type: 3,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a literal (type 4) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseLiteralPacket(bitstream, version) {
    const value = readVariableNumber(bitstream);

    return {
        type: 4,
        version,
        value,
        subPackets: []
    };
}

/**
 * Parses a greater than (type 5) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseGreaterThanPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const [ sub1, sub2 ] = subPackets;
    const value = sub1.value > sub2.value ? 1n : 0n;

    return {
        type: 5,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a less than (type 6) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseLessThanPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const [ sub1, sub2 ] = subPackets;
    const value = sub1.value < sub2.value ? 1n : 0n;

    return {
        type: 6,
        version,
        subPackets,
        value
    };
}

/**
 * Parses an equal to (type 7) packet
 * @param {import('./day16common.js').Bitstream} bitstream
 * @param {number} version
 * @returns {import('./day16common').Packet}
 */
function parseEqualToPacket(bitstream, version) {
    const subPackets = parseSubPackets(bitstream);
    const [ sub1, sub2 ] = subPackets;
    const value = sub1.value === sub2.value ? 1n : 0n;

    return {
        type: 7,
        version,
        subPackets,
        value
    };
}

/**
 * Parses a packet from the stream
 * @param {import('./day16common.js').Bitstream} bitstream
 * @returns {import('./day16common').Packet}
 */
function parsePacket(bitstream) {
    // Read version
    const version = readNumber(bitstream, 3);

    // Read type
    const type = readNumber(bitstream, 3);

    // Dispatch based on type
    if (type === 0) {
        return parseSumPacket(bitstream, version);
    } else if (type === 1) {
        return parseProductPacket(bitstream, version);
    } else if (type === 2) {
        return parseMinimumPacket(bitstream, version);
    } else if (type === 3) {
        return parseMaximumPacket(bitstream, version);
    } else if (type === 4) {
        return parseLiteralPacket(bitstream, version);
    } else if (type === 5) {
        return parseGreaterThanPacket(bitstream, version);
    } else if (type === 6) {
        return parseLessThanPacket(bitstream, version);
    } else if (type === 7) {
        return parseEqualToPacket(bitstream, version);
    } else {
        throw new TypeError(`Unknown packet type ${ type }`);
    }
}

/**
 * Generates a pretty-printed string for a packet
 * @param {import('./day16common').Packet} packet
 * @param {string} padding
 * @returns {string}
 */
function printPacket(packet, padding) {
    if (packet.subPackets.length === 0) {
        return `${padding}Type ${packet.type} (v${packet.version}) : ${packet.value}`;
    } else {
        const lines = [];
        lines.push(`${padding}Type ${packet.type} (v${packet.version}) : ${packet.value} [`);
        for (const subPacket of packet.subPackets) {
            const subLine = printPacket(subPacket, padding + '  ');
            lines.push(subLine);
        }
        lines.push(`${padding}]`);
        return lines.join('\n');
    }
}

module.exports = {
    /**
     * Parses an input file into a packet
     * @param {string} path}
     */
    parseInput(path) {
        // Read input into raw data
        const input = fs.readFileSync(path, 'utf8').trim();
        const raw = Buffer.from(input, 'hex');

        // Align buffer to even 32bits + extra 4 bytes on the end
        const extraBytes = 8 - (raw.length % 4);
        const buffer = Buffer.concat([ raw, Buffer.alloc(extraBytes, 0) ]);

        // Create bitstream
        const bitstream = {
            buffer,
            address: 0
        };

        // Parse the root packet
        return parsePacket(bitstream);
    },

    /**
     * Pretty-prints a packet
     * @param {import('./day16common').Packet} packet
     */
    printPacket(packet) {
        return printPacket(packet, '');
    }
};