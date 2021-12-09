const parse = require('./day3parse.js');

// Read input and compute MCBs
const bits = parse.loadBits('input.txt');
const pivot = parse.pivotBits(bits);
const mcbs = parse.getMostCommonBits(pivot);

// Individual bits of the final values will be accumulated here.
const gammaBits = [];
const epsilonBits = [];

// Sort each bit
for (const bit of mcbs) {
    // The MCB is the gamma bit
    gammaBits.push(bit);

    // The LCB is the epsilon bit.
    // LCB is the opposite of MCB.
    epsilonBits.push(bit === 1 ? 0 : 1);
}

// Parse bits into numbers
const gamma = parseInt(gammaBits.join(''), 2);
const epsilon = parseInt(epsilonBits.join(''), 2);

const power = gamma * epsilon;
console.log(`Day3 Part1: Gamma=${ gamma } Epsilon=${ epsilon } Power=[${ power }]`);