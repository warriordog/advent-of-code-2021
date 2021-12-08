const io = require('../common/io.js');

/** @type {Record<number, number[]>} */
const numDigitsMap = {
    2: [1],
    3: [7],
    4: [4],
    5: [2,3,5],
    6: [0,6,9],
    7: [8]
};

/** @type {{ patterns: string[][], outputs: string[][]}[]} */
const inputs = io.readLines('test.txt')
    .map(entry => {
        const [ patterns, outputs ] = entry.split('|');
        return {
            patterns: patterns.trim().split(' ')
                .map(pattern => pattern.split('').sort()),
            outputs: outputs.trim().split(' ')
                .map(output => output.split('').sort())
        };
    });

let occurrences = 0;
for (const input of inputs) {
    for (const output of input.outputs) {
        const digits = output.length;
        if (numDigitsMap[digits]) {
            occurrences++;
        }
    }
}

console.log(`Day8 Part1: The answer is ${ occurrences }.`);