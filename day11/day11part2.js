const { parseInput, doStep } = require('./day11common.js');

const grid = parseInput('input.txt');
const gridSize = grid.xLength * grid.yLength;

let step = 0;
for (let flashes = 0; flashes !== gridSize; flashes = doStep(grid)) {
    // Count steps until all flash
    step++;
}

console.log(`Day1 Part2: All octopuses will flash on step [${ step }].`);