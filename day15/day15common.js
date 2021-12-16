const io = require('../common/io.js');

/** @typedef {number[][]} Grid */
/** @typedef {{ risk: number, path: number[] }} PathSegment */
/** @typedef {(PathSegment | null | undefined)[]} RiskLookup */

module.exports = {
    /**
     * @param {string} path
     * @returns {Grid} grid
     */
    parseInput(path) {
        return io.readIntsGrid(path);
    },

    /**
     *
     * @param {Grid} grid
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    computeIndex(grid, x, y) {
        const gridSize = grid.length;
        return (y * gridSize) + x;
    },

    /**
     *
     * @param {Grid} grid
     * @returns {RiskLookup}
     */
    createRiskLookup(grid) {
        /** @type {RiskLookup} */
        const lookup = [];
        for (let i = 0; i < grid.length * grid.length; i++) {
            lookup[i] = undefined;
        }
        lookup[lookup.length - 1] = { risk: 0, path: [] };
        return lookup;
    },

    /**
     * @param {Grid} grid
     * @param {number} index
     * @returns {{x: number, y: number}}
     */
    decodeIndex(grid, index) {
        return {
            y: Math.floor(index / grid.length),
            x: index % grid.length
        };
    },

    /**
     *
     * @param {Grid} grid
     * @param {number[]} path
     * @returns {{x: number, y: number, risk: number, dX: number, dY: number}[]}
     */
    decodePath(grid, path) {
        const decoded = path
            .map((index, i) => {
                const y = Math.floor(index / grid.length);
                const x = index % grid.length;
                return {
                    x,
                    y,
                    risk: grid[y][x],
                    dX: 0,
                    dY: 0
                };
            })
        ;

        for (let i = 1; i < decoded.length; i++) {
            const step = decoded[i];
            const prev = decoded[i - 1];

            step.dX = step.x - prev.x;
            step.dY = step.y - prev.y;
        }

        return decoded;
    }
};