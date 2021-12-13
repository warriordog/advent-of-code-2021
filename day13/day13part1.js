const { parseInput, applyFold } = require('./day13common.js');
const { folds, grid } = parseInput('input.txt');

// Apply first fold
applyFold(folds[0], grid);

// Count dots
const totalDots = grid.dots
    .reduce((sum, row) => sum + row
        .reduce((rowSum, dot) => rowSum + (dot ? 1 : 0), 0),
    0)
;

console.log(`Day13 Part1: After folding once, there are [${ totalDots }] visible dots.`);

