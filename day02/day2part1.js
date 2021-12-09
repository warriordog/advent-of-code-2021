const inputs = require('./day2parse.js').loadInput('input.txt');

let position = 0;
let depth = 0;

inputs.forEach(input => {
    if (input.command === 'forward') {
        position += input.arg;

    } else if (input.command === 'up') {
        depth -= input.arg;

    } else if (input.command === 'down') {
        depth += input.arg;

    } else {
        console.warn(`Ignoring unknown command '${ input.command }' (arg=${ input.arg })`);
    }
});

const result = position * depth;
console.log(`Day2 Part1: Position=${ position } Depth=${ depth } Result=[${ result }]`);