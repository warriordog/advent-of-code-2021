const io = require('../common/io');

/**
 * @typedef {object} Grid
 * @property {number} xLength
 * @property {number} yLength
 * @property {number[][]} octs
 */

/**
 * Increments the octopus as (x,y).
 * If x or y is out of bounds, then nothing happens.
 * Octopuses with a value of zero are not incremented
 * @param {Grid} grid
 * @param {number} x
 * @param {number} y
 */
function incrementInStep(grid, x, y) {
    if (x >= 0 && x < grid.xLength) {
        if (y >= 0 && y < grid.yLength) {
            // Don't increment 0, because that has already flashed this step
            if (grid.octs[x][y] !== 0) {
                grid.octs[x][y]++;
            }
        }
    }
}

module.exports = {
    /**
     * Reads the input file into a grid
     * @param {string} path
     * @return {Grid}
     */
    parseInput(path) {
        const octs = io.readIntsGrid(path);
        return {
            xLength: octs.length,
            yLength: octs[0].length,
            octs
        };
    },

    /**
     * Processes a single step for the grid.
     * Returns the number of octopuses that flashed.
     * @param {Grid} grid
     * @return {number}
     */
    doStep(grid) {
        // Count all flashes during the step
        let flashes = 0;

        // Increase all by 1
        for (let x = 0; x < grid.xLength; x++) {
            for (let y = 0; y < grid.yLength; y++) {
                grid.octs[x][y]++;
            }
        }

        // Process until the step is done
        let flashed;
        do {
            flashed = false;

            // Tick each octopus
            for (let x = 0; x < grid.xLength; x++) {
                for (let y = 0; y < grid.yLength; y++) {
                    // Check if the octopus is ready to flash
                    if (grid.octs[x][y] > 9) {
                        // Reset to 0
                        grid.octs[x][y] = 0;

                        // Flash it
                        incrementInStep(grid, x - 1, y - 1);
                        incrementInStep(grid, x - 1, y);
                        incrementInStep(grid, x - 1, y + 1);
                        incrementInStep(grid, x, y - 1);
                        incrementInStep(grid, x, y + 1);
                        incrementInStep(grid, x + 1, y - 1);
                        incrementInStep(grid, x + 1, y);
                        incrementInStep(grid, x + 1, y + 1);

                        // Mark as flashed so that we continue the step
                        flashed = true;
                        flashes++;
                    }
                }
            }
        } while (flashed);

        // Return the total number of flashes during this step
        return flashes;
    }
};