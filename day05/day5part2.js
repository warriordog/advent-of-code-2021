const { Grid, readLines } = require('./day5common.js');

// Read each line and write it to the grid
const grid = new Grid();
readLines('input.txt').forEach(line => grid.applyLine(line));

// Find all the points with 2+ vents
const overlap = grid.getPoints().filter(p => p.value >= 2);
console.log(`Day5 Part2: There are ${ overlap.length } points of overlap.`);