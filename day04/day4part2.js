const { parseInput, markNumber, hasWon, countUnmarked } = require('./day4common.js');
const { numbers, boards } = parseInput('input.txt');

/** @type {import('./day4common.js').Board | null} */
let losingBoard = null;
let lastNumber = 0;

// Process each number until the last board wins
outer:
    for (const num of numbers) {
        // Record the current number for the final calculation
        lastNumber = num;

        // Check each board
        for (const board of Array.from(boards)) {
            // Scan for and mark winning numbers
            const found = markNumber(board, num);

            // If we had a match, then check if the board has won
            if (found && hasWon(board)) {
                // Check if this is the last board
                if (boards.length === 1) {
                    // Record the last winning board
                    losingBoard = board;
                    break outer;
                } else {
                    // If NOT the last board, then remove it from the set.
                    // This acts as an easy way to mark a board as won,
                    //  because I am too lazy to update the schema to store a flag.
                    const boardIdx = boards.indexOf(board);
                    boards.splice(boardIdx, 1);
                }
            }
        }
    }

if (!losingBoard) {
    throw new Error('No losing board found!');
}

// Add up all the unmarked cells
const boardSum = countUnmarked(losingBoard);
const score = boardSum * lastNumber;
console.log(`Day4 Part2: Score=[${ score }] Sum=${ boardSum } Num=${ lastNumber }`);