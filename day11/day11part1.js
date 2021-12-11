const { parseInput, doStep } = require('./day11common.js');

const grid = parseInput('input.txt');

// Step 100 times and count the flashes
let totalFlashes = 0;
for (let step = 0; step < 100; step++) {
    totalFlashes += doStep(grid);
}

console.log(`Day1 Part1: There were [${ totalFlashes }] flashes during 100 steps.`);