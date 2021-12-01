const depths = require('../common/io').readInts('input.txt');

const windows = [];
for (let window = 0; window <= depths.length - 3; window++) {
    let sum = 0;
    for (let offset = 0; offset < 3; offset++) {
        sum += depths[window + offset];
    }
    windows.push(sum);
}


let increases = 0;
let lastDepth = null;
for (const depth of windows) {
    if (lastDepth !== null && depth > lastDepth) {
        increases++;
    }
    lastDepth = depth;
}

console.log(`Day1 Part2: There are ${ increases } increases.`);