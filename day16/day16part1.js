const { parseInput, printPacket } = require('./day16common.js');

const root = parseInput('input.txt');

// Uncomment to dump packet structure:
// const string = printPacket(root);
// console.log(string);

// Count total version
function countTotalVersion(packet) {
    return packet.version + packet.subPackets.reduce((total, sub) => total + countTotalVersion(sub), 0);
}
const total = countTotalVersion(root);

console.log(`Day16 Part1: The total version is [${total}].`);