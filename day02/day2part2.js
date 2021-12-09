const inputs = require('./day2parse.js').loadInput('input.txt');

let position = 0;
let depth = 0;
let aim = 0;

inputs.forEach(input => {
    if (input.command === 'forward') {
        position += input.arg;
        depth += aim * input.arg;

    } else if (input.command === 'up') {
        aim -= input.arg;

    } else if (input.command === 'down') {
        aim += input.arg;

    } else {
        console.warn(`Ignoring unknown command '${ input.command }' (arg=${ input.arg })`);
    }
});

const result = position * depth;
console.log(`Day2 Part2: Position=${ position } Depth=${ depth } Result=[${ result }]`);