const fs = require("fs");

module.exports = {
    /**
     * Reads all lines from a file as strings
     * @param {string} path
     * @returns {string[]}
     */
    readLines(path) {
        return fs.readFileSync(path, 'utf-8')
            .split('\n')
            .filter(l => l.length > 0);
    },

    /**
     * Reads a list of integers from a file
     * @param {string} path
     * @returns {number[]}
     */
    readInts(path) {
        return this.readLines(path).map(l => parseInt(l));
    }
};