const io = require("../common/io.js");
const fish = io.readIntsLine('input.txt');

const spawnTime = 7;
const growTime = 2;

function simulate(days) {
    for (let day = 0; day < days; day++) {
        // Simulate each fish, but not the new ones added today.
        const fishLength = fish.length;
        for (let f = 0; f < fishLength; f++) {
            // Get the fish and decrease days
            let daysLeft = fish[f] - 1;

            if (daysLeft < 0) {
                // Reset spawn time
                fish[f] = spawnTime - 1;

                // Spawn a new fish
                fish.push(spawnTime + growTime - 1);
            } else {
                // Decrement days left
                fish[f] = daysLeft;
            }
        }
    }
}

simulate(80);

console.log(`Day6 Part1: After 80 days, there are [${ fish.length }] fish.`);