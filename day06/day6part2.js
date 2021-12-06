const io = require("../common/io.js");
const fish = io.readIntsLine('input.txt');

const spawnTime = 7;

// Map days remaining to the number of fish with that amount.
const daysRemaining = [ 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n ];

// Load initial fish
fish.forEach(f => daysRemaining[f]++);

function simulate(days) {
    for (let day = 0; day < days; day++) {
        // Pop the bottom, reset AND add that many fish
        const newFish = daysRemaining.shift();

        // Add new fish (replace the spot that was popped off)
        daysRemaining.push(newFish)

        // Reset the fish
        daysRemaining[spawnTime - 1] += newFish;
    }
}

simulate(256);

const count = daysRemaining.reduce((sum, n) => sum + n, 0n);
console.log(`Day6 Part2: After 256 days, there are ${ count } fish.`);