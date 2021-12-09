const { parseInput, markNumber, hasWon } = require('./day4common.js');
const { numbers, boards } = parseInput('input.txt');

/** @type {import('./day4common.js').Board | null} */
let winningBoard = null;
let lastNumber = 0;

// Process each number until a board wins
outer:
for (const num of numbers) {
    // Record the current number for the final calculation
    lastNumber = num;

    // Check each board
    for (const board of boards) {
        // Scan for and mark winning numbers
        const found = markNumber(board, num);

        // If we had a match, then check if the board has won
        if (found && hasWon(board)) {
            // If it won, then record it and stop looping
            winningBoard = board;
            break outer;
        }
    }
}

if (!winningBoard) {
    throw new Error('No winning board found!');
}

// Add up all the unmarked cells
const boardSum = winningBoard.reduce((sum, row) => {
    for (const cell of row) {
        if (!cell.marked) {
            sum += cell.num;
        }
    }
    return sum;
}, 0);

const score = boardSum * lastNumber;
console.log(`Day4 Part1: Score=[${ score }] Sum=${ boardSum } Num=${ lastNumber }`);