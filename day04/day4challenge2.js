const { parseInput, markNumber, hasWon, countUnmarked } = require('./day4common.js');
const input = parseInput('4-3600-30.in');

/** @type {import('./day4common.js').Board | null} */
let winningBoard = null;
let winningNumber = 0;

/** @type {import('./day4common.js').Board | null} */
let losingBoard = null;
let losingNumber = 0;

// List of remaining (not won) boards
let boards = input.boards;

// Process each number until the last board wins
outer:
    for (const num of input.numbers) {
        // List of boards to remove
        const removeBoards = new Set();

        // Check each board
        for (const board of boards) {
            // Scan for and mark winning numbers
            const found = markNumber(board, num);

            // If we had a match, then check if the board has won
            if (found && hasWon(board)) {
                // If this is the first board to win, then record it
                if (!winningBoard) {
                    winningBoard = board;
                    winningNumber = num;
                }

                // Check if this is the last board
                if (boards.length === 1) {
                    // Record the last winning board
                    losingBoard = board;
                    losingNumber = num;
                    break outer;

                } else {
                    // If NOT the last board, then remove it from the set.
                    // This is a delayed action to avoid needing to copy the array on every iteration.
                    removeBoards.add(board);
                }
            }
        }

        // Remove any removed boards
        if (removeBoards.size > 0) {
            boards = boards.filter(b => !removeBoards.has(b));
        }
    }

if (!losingBoard) {
    throw new Error('No losing board found!');
}
if (!winningBoard) {
    throw new Error('No winning board found!');
}

// Add up all the unmarked cells
const winningSum = countUnmarked(winningBoard);
const winningScore = winningSum * winningNumber;
console.log(`Day4 Challenge2 Part1: Score=[${ winningScore }] Sum=${ winningSum } Num=${ winningNumber }`);

// Add up all the unmarked cells
const losingSum = countUnmarked(losingBoard);
const losingScore = losingSum * losingNumber;
console.log(`Day4 Challenge2 Part2: Score=[${ losingScore }] Sum=${ losingSum } Num=${ losingNumber }`);