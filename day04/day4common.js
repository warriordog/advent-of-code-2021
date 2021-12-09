const fs = require("fs");

/** @typedef {{ num: number, marked: boolean }[][]} Board*/

module.exports = {
    /**
     * @param {string} path
     * @returns {{numbers: number[], boards: Board[]}}
     */
    parseInput(path) {
        // Read input and split into double-newline-delimited segments
        const parts = fs.readFileSync(path, 'utf-8')
            .split(/(?:\n|\r\n){2}/gm)
        ;

        // Parse the first segment into a sequence of bingo inputs
        const numbers = parts[0]
            .split(',')
            .map(n => parseInt(n))
        ;

        // Parse all remaining sections into boards
        const boards = parts.slice(1)
            .map(board => board
                // Split each board into lines
                .split(/\n|\r\n/gm)
                // Strip blank lines (handles trailing newline in file)
                .filter(l => l.length > 0)
                // Read all the numbers and parse them into cells
                .map(row => Array.from(row.matchAll(/\d+/g))
                    .map(cell => ({
                        num: parseInt(cell[0]),
                        marked: false
                    }))
                )
            )
        ;

        return {
            numbers,
            boards
        };
    },

    /**
     * @param {Board} board
     * @param {number} num
     * @returns {boolean}
     */
    markNumber(board, num) {
        for (const row of board) {
            for (const cell of row) {
                if (cell.num === num) {
                    cell.marked = true;
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * @param {Board} board
     * @returns {boolean}
     */
    hasWon(board) {
        // Scan rows
        for (const row of board) {
            if (row.every(cell => cell.marked)) {
                return true;
            }
        }

        // Scan columns
        for (let y = 0; y < 5; y++) {
            let colMatch = true;
            for (let x = 0; x < 5; x++) {
                if (!board[x][y].marked) {
                    colMatch = false;
                    break;
                }
            }
            if (colMatch) return true;
        }

        return false;
    },

    /**
     * @param {Board} board
     */
    printBoard(board) {
        console.log('-----');
        for (const row of board) {
            console.log(row.map(cell => cell.marked ? '#' : ' ').join(''));
        }
    }
};