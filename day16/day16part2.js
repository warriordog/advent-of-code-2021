const { parseInput, printPacket } = require('./day16common.js');

const root = parseInput('input.txt');

// Uncomment to dump packet structure:
// const string = printPacket(root);
// console.log(string);

console.log(`Day16 Part2: The final value is [${root.value}].`);