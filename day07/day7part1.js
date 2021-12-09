const io = require("../common/io.js");

// Read all crabs
const crabs = io.readIntsLine('input.txt');

// Find minimum and maximum position.
// There is no scenario where the best position is further than the crabs on the ends, so use those values.
const targetMin = crabs.reduce((min, crab) => crab < min ? crab : min, crabs[0]);
const targetMax = crabs.reduce((max, crab) => crab > max ? crab : max, crabs[0]);

/** @type {{ target: number, cost: number }[]} */
const moveCosts = [];

// Check each position in the valid range and compute its movement cost
for (let target = targetMin; target <= targetMax; target++) {

    // Compute the cost for all crabs to move to this position
    const cost = crabs.reduce((cost, crab) => cost + Math.abs(crab - target), 0);
    moveCosts.push({
        target,
        cost
    });
}

// Find the cheapest move
const cheapestMove = moveCosts.reduce((best, move) => move.cost < best.cost ? move : best, moveCosts[0]);
console.log(`Day7 Part1: The cheapest position is ${ cheapestMove.target }, costing [${ cheapestMove.cost }] fuel.`);