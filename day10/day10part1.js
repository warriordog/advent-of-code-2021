const { readInputs, tokenize, TYPE_UNEXPECTED } = require('./day10common.js');

let score = 0;

// Process each input
const inputs = readInputs('input.txt');
for (const input of inputs) {
    // Process each token
    for (const token of tokenize(input)) {
        // Check for unexpected characters (this indicates corruption)
        if (token.type === TYPE_UNEXPECTED) {
            // Add the correct score
            if (token.char === ')') {
                score += 3;
            } else if (token.char === ']') {
                score += 57;
            } else if (token.char === '}') {
                score += 1197;
            } else if (token.char === '>') {
                score += 25137;
            } else {
                throw new Error(`Unexpected token: "${ token.char }"`);
            }
        }
    }
}

console.log(`Day10 Part1: The total syntax error score is [${ score }].`);