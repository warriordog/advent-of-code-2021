const io = require('../common/io.js');

/** @typedef {{ size: number, squares: { num: number, marked: boolean }[][]}} Board*/

module.exports = {
    /**
     * @param {string} path
     * @returns {{numbers: number[], boards: Board[]}}
     */
    parseInput(path) {
        // Read input and split into double-newline-delimited segments
        const parts = io.readSections(path);

        // Parse the first segment into a sequence of bingo inputs
        const numbers = parts[0]
            .split(',')
            .map(n => parseInt(n))
        ;

        // Parse all remaining sections into boards
        const boards = parts.slice(1)
            .map(board => {
                const squares = board
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
                    );
                return {
                    squares,
                    size: squares.length
                };
            })
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
        for (const row of board.squares) {
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
        for (const row of board.squares) {
            if (row.every(cell => cell.marked)) {
                return true;
            }
        }

        // Scan columns
        for (let y = 0; y < board.size; y++) {
            let colMatch = true;
            for (let x = 0; x < board.size; x++) {
                if (!board.squares[x][y].marked) {
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
        for (const row of board.squares) {
            console.log(row.map(cell => cell.marked ? '#' : ' ').join(''));
        }
    },

    /**
     * @param {Board} board
     * @returns {number}
     */
    countUnmarked(board) {
        return board.squares.reduce((sum, row) => {
            for (const cell of row) {
                if (!cell.marked) {
                    sum += cell.num;
                }
            }
            return sum;
        }, 0);
    }
};