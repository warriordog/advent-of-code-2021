const { Grid, readLines, isAxisAligned } = require('./day5common.js');

// Read each line and write it to the grid
const grid = new Grid();
readLines('input.txt')
    .filter(line => isAxisAligned(line))
    .forEach(line => grid.applyLine(line));

// Find all the points with 2+ vents
const overlap = grid.getPoints().filter(p => p.value >= 2);
console.log(`Day5 Part1: There are ${ overlap.length } points of overlap.`);