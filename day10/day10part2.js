const { readInputs, tokenize, TYPE_END_OF_LINE} = require('./day10common.js');

let scores = [];

// Process each input
const inputs = readInputs('input.txt');
for (const input of inputs) {
    // Process each token
    for (const token of tokenize(input)) {
        // Check for unexpected characters (this indicates corruption)
        if (token.type === TYPE_END_OF_LINE) {
            // Compute the score from the expectedClosingTags array.
            // This is an implementation detail of the tokenizer, but it gives us the correct result "for free".
            scores.push(token.expectedClosingTags.reduce((score, char) => {
                score *= 5;
                if (char === ')') score += 1;
                else if (char === ']') score += 2;
                else if (char === '}') score += 3;
                else if (char === '>') score += 4;
                else throw new Error(`Unknown token: "${ char }"`);
                return score;
            }, 0));
        }
    }
}


// Find winning score
scores.sort((s1, s2) => s1 - s2);
const winningScore = scores[(scores.length - 1) / 2];

console.log(`Day10 Part2: The winning score is [${ winningScore }].`);