const io = require("../common/io.js");
const fish = io.readIntsLine('test.txt');

// Map days remaining to the number of fish with that amount.
let timer0 = fish.filter(f => f === 0).reduce((sum, f) => sum + BigInt(f), 0n);
let timer1 = fish.filter(f => f === 1).reduce((sum, f) => sum + BigInt(f), 0n);
let timer2 = fish.filter(f => f === 2).reduce((sum, f) => sum + BigInt(f), 0n);
let timer3 = fish.filter(f => f === 3).reduce((sum, f) => sum + BigInt(f), 0n);
let timer4 = fish.filter(f => f === 4).reduce((sum, f) => sum + BigInt(f), 0n);
let timer5 = fish.filter(f => f === 5).reduce((sum, f) => sum + BigInt(f), 0n);
let timer6 = fish.filter(f => f === 6).reduce((sum, f) => sum + BigInt(f), 0n);
let timer7 = fish.filter(f => f === 7).reduce((sum, f) => sum + BigInt(f), 0n);
let timer8 = fish.filter(f => f === 8).reduce((sum, f) => sum + BigInt(f), 0n);

const start = Date.now();
for (let day = 0; day < 9999999; day++) {
    // Pop the bottom, reset AND add that many fish
    const newFish = timer0;

    // Shift down
    timer0 = timer1;
    timer1 = timer2;
    timer2 = timer3;
    timer3 = timer4;
    timer4 = timer5;
    timer5 = timer6;
    timer6 = timer7 + newFish; // Reset fish
    timer7 = timer8;
    timer8 = newFish; // Add new fish
}
const end = Date.now();
const time = (end - start) / 1000;

const count = timer0 + timer1 + timer2 + timer3 + timer4 + timer5 + timer6 + timer7 + timer8;
console.log(`Day6 Part2: After 9999999 days, there are ${ count } fish. Complete in ${ time } seconds.`);