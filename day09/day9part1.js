const io = require("../common/io.js");

// Read all locations into a 2D array of form [x][y].
// The origin (0,0) is top-left.
const locations = io.readLines('input.txt')
    .map(line => line.split('')
        .map(num => parseInt(num)));

/**
 * Checks if a depth is lower than the depth at a specified location.
 * Out-of-bounds locations are handled gracefully.
 * @param {number} depth
 * @param {number} x
 * @param {number} y
 */
function isLowerThan(depth, x, y) {
    const row = locations[x];
    if (!row) return true; // JS returns undefined for out-of-bounds array reads

    const other = row[y]; // JS returns undefined for out-of-bounds array reads
    return other === undefined || depth < other;
}

let lowPoints = 0;
let riskLevel = 0;

// Scan each x,y location and compute the risk level of all low points
for (let x = 0; x < locations.length; x++){
    const row = locations[x];
    for (let y = 0; y < row.length; y++){
        const depth = row[y];

        // Check all the neighbors and skip if any are lower
        if (!isLowerThan(depth, x, y + 1)) continue;
        if (!isLowerThan(depth, x, y - 1)) continue;
        if (!isLowerThan(depth, x + 1, y)) continue;
        if (!isLowerThan(depth, x - 1, y)) continue;

        // Increment counters
        lowPoints++;
        riskLevel += depth + 1;
    }
}

console.log(`Day9 Part1: There are [${ lowPoints }] low points for a risk level of [${ riskLevel }].`);