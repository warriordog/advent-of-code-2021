const parse = require('./day3parse.js');

// Read input
const bits = parse.loadBits('input.txt');

// The final oxygen level will be narrowed here, starting with the full set.
let oxyBits = bits;
for (let i = 0; oxyBits.length > 1; i++) {
    // Compute the MCB of the remaining bits
    const pivot = parse.pivotBits(oxyBits);
    const mcbs = parse.getMostCommonBits(pivot);

    // Remove any inputs that don't match the MCB
    oxyBits = oxyBits.filter(bit => bit[i] === mcbs[i]);
}

// The final CO2 level will be narrowed here, starting with the full set.
let co2Bits = bits;
for (let i = 0; co2Bits.length > 1; i++) {
    // Compute the MCB of the remaining bits
    const pivot = parse.pivotBits(co2Bits);
    const mcbs = parse.getMostCommonBits(pivot);

    // Remove any inputs that don't match the LCB.
    // The LCB is computed by reversing the MCB
    co2Bits = co2Bits.filter(bit => bit[i] !== mcbs[i]);
}

// Parse the bits into numbers
const oxygen = parseInt(oxyBits[0].join(''), 2);
const co2 = parseInt(co2Bits[0].join(''), 2);

const life = oxygen * co2;
console.log(`Day3 Part2: Oxygen=[${ oxygen }] CO2=[${ co2 }] Life=[${ life }]`);