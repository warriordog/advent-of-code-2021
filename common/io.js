const fs = require("fs");

module.exports = {
    /**
     * Reads all lines from a file as strings
     * @param path
     * @returns {string[]}
     */
    readLines(path) {
        return fs.readFileSync(path, 'utf-8').split('\n');
    },

    /**
     * Reads a list of integers from a file
     * @param path
     * @returns {number[]}
     */
    readInts(path) {
        return this.readLines(path).map(l => parseInt(l));
    }
};