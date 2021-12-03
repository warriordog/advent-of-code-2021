const io = require("../common/io")

module.exports = {
    /**
     * Reads all bits from the input
     * @param {string} path
     * @returns {Array<0 | 1>[]}
     */
    loadBits(path) {
        return io.readLines(path)
            .map(line => line
               .split('')
               .map(l => l === '1' ? 1 : 0)
            );
    },

    /**
     * Pivot the input lines to be bit-position-indexed
     * @param {Array<0 | 1>[]} bits
     * @returns {Array<0 | 1>[]}
     */
    pivotBits(bits) {
        const pivoted = [];
        for (let i = 0; i < bits[0].length; i++) {
            pivoted.push(bits.map(l => l[i]));
        }
        return pivoted;
    },

    /**
     * Find the most common bit from a pivoted input.
     * If 1 and 0 are tied, then 1 is selected as the default.
     * @param {Array<0 | 1>[]} pivot
     * @returns {Array<0 | 1>}
     */
    getMostCommonBits(pivot) {
        return pivot
            // Use an under/over algorithm to find the most common bit.
            // 1s increase the sum, 0s decrease it.
            .map(bit => bit.reduce((val, b) => {
                if (b === 1) return val + 1;
                else return val - 1;
            }, 0))

            // If the result is positive, then the MCB is 1 (or a tie).
            // If the result is negative, then the MCB is 0.
            .map(weight => weight >= 0 ? 1 : 0);
    }
}