const { computeIncrement, readLines, isAxisAligned } = require('./day5common.js');

/** @type {number[][]} */
const grid = [];
let overlaps = 0;

function increment(x, y) {
    let row = grid[x];
    if (!row) {
        row = [];
        grid[x] = row;
    }

    const value = (row[y] || 0) + 1;
    row[y] = value;

    if (value === 2) {
        overlaps++;
    }
}

function addLine(line) {
    const xInc = computeIncrement(line.x1, line.x2);
    const yInc = computeIncrement(line.y1, line.y2);
    let x = line.x1;
    let y = line.y1;

    do {
        increment(x, y);

        x += xInc;
        y += yInc;

        // Hacky special case to handle inclusive ending points
        if (x === line.x2 && y === line.y2) {
            increment(x, y);
        }
    } while (x !== line.x2 || y !== line.y2);
}

const aaLines = readLines('5-20000-6400.in');

// Load axis-aligned lines
aaLines.filter(line => isAxisAligned(line))
    .forEach(line => addLine(line));
console.log(`Day5 Challenge1 Part1: There are ${ overlaps } points of overlap.`);

// Load diagonal lines
aaLines.filter(line => !isAxisAligned(line))
    .forEach(line => addLine(line));
console.log(`Day5 Challenge1 Part2: There are ${ overlaps } points of overlap.`);