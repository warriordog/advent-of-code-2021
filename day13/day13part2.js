const { parseInput, printGrid, applyFold} = require('./day13common.js');
const { folds, grid } = parseInput('input.txt');

// Apply all folds
for (const fold of folds) {
    applyFold(fold, grid);
}

// Print grid
console.log(`Day13 Part2: The code is:`);
printGrid(grid);


