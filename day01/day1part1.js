const depths = require('../common/io').readInts('input.txt');

let increases = 0;
let lastDepth = null;
for (const depth of depths) {
    if (lastDepth !== null && depth > lastDepth) {
        increases++;
    }
    lastDepth = depth;
}

console.log(`Day1 Part1: There are ${ increases } increases.`);