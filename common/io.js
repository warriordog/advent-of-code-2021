const fs = require("fs");

module.exports = {
    /**
     * Reads all lines from a file as strings
     * @param {string} path
     * @returns {string[]}
     */
    readLines(path) {
        return fs.readFileSync(path, 'utf-8')
            .split(/[\r\n]/gm)
            .filter(l => l.length > 0);
    },

    /**
     * Reads a list of integers from a file
     * @param {string} path
     * @returns {number[]}
     */
    readInts(path) {
        return this.readLines(path).map(l => parseInt(l));
    },

    /**
     * Reads a list of integers from a single line
     * @param {string} path
     * @returns {number[]}
     */
    readIntsLine(path) {
        return Array.from(fs.readFileSync(path, 'utf-8').matchAll(/\d+/gm))
            .flatMap(match => match[0])
            .map(n => parseInt(n))
        ;
    },


    /**
     * Reads a grid of integers from a file
     * @param {string} path
     * @returns {number[][]}
     */
    readIntsGrid(path) {
        return this.readLines(path)
            .map(line => line
                .split('')
                .map(n => parseInt(n)));
    }
};