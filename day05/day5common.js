const io = require("../common/io.js");

/** @typedef {{ x1: number, y1: number, x2: number, y2: number}} Line */

/**
 * Computes the unit increment to move from n1 towards n2.
 * @param {number} n1
 * @param {number} n2
 * @returns {number}
 */
function computeIncrement(n1, n2) {
    if (n1 < n2) return 1;
    if (n1 > n2) return -1;
    return 0;
}

module.exports = {
    /**
     * Reads and parses the input file
     * @param {string} path
     * @returns {Line[]}
     */
    readLines(path) {
        return io.readLines(path)
            .map(line => line.match(/(\d+),(\d+) -> (\d+),(\d+)/).slice(1))
            .map(line => line.map(n => parseInt(n)))
            .map(([x1,y1,x2,y2]) => ({x1, y1, x2, y2}))
        ;
    },

    /**
     * Checks if a line is axis-aligned (horizontal or vertical)
     * @param {Line} line
     * @returns {boolean}
     */
    isAxisAligned(line) {
        return line.x1 === line.x2 || line.y1 === line.y2;
    },

    /**
     * Stores a 2-dimensional sparse grid of numbers
     */
    Grid: class {
        constructor() {
            /** @type {Map<number, Map<number, number>> } */
            this.xMap = new Map();
        }

        /**
         * Gets the value at a position
         * @param {number} x
         * @param {number} y
         * @returns {number}
         */
        get(x, y) {
            let row = this.xMap.get(x);
            if (!row) {
                row = new Map();
                this.xMap.set(x, row);
            }

            return row.get(y) || 0;
        }


        /**
         * Sets the value at a position
         * @param {number} x
         * @param {number} y
         * @param {number} value
         */
        set(x, y, value) {
            let row = this.xMap.get(x);
            if (!row) {
                row = new Map();
                this.xMap.set(x, row);
            }

            row.set(y, value);
        }


        /**
         * Adds one to the value at a position.
         * If the position is unset, then it is set to 1.
         * @param {number} x
         * @param {number} y
         */
        increment(x, y) {
            let row = this.xMap.get(x);
            if (!row) {
                row = new Map();
                this.xMap.set(x, row);
            }

            const value = (row.get(y) || 0) + 1;
            row.set(y, value);
        }

        /**
         * Increments each point in a line.
         * @param {Line} line
         */
        applyLine(line) {
            const xInc = computeIncrement(line.x1, line.x2);
            const yInc = computeIncrement(line.y1, line.y2);
            let x = line.x1;
            let y = line.y1;

            do {
                this.increment(x, y);

                x += xInc
                y += yInc;

                // Hacky special case to handle inclusive ending points
                if (x === line.x2 && y === line.y2) {
                    this.increment(x, y);
                }
            } while (x !== line.x2 || y !== line.y2);
        }

        /**
         * Gets all the points with a value of at least 1.
         * @returns {{x: number, y: number, value: number}[]}
         */
        getPoints() {
            const points = [];
            for (const [x, row] of this.xMap.entries()) {
                for (const [y, value] of row.entries()) {
                    points.push({ x, y, value });
                }
            }
            return points;
        }
    }
};