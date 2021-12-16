const fs = require("fs");

module.exports = {
    /**
     * Reads all lines from a file as strings
     * @param {string} path
     * @returns {string[]}
     */
    readLines(path) {
        const text = fs.readFileSync(path, 'utf-8');
        return this.splitLines(text)
            .filter(l => l.length > 0)
        ;
    },

    /**
     * Reads a list of integers from a file
     * @param {string} path
     * @returns {number[]}
     */
    readInts(path) {
        return this.readLines(path)
            .map(l => parseInt(l))
        ;
    },

    /**
     * Reads a list of integers from a single line
     * @param {string} path
     * @returns {number[]}
     */
    readIntsLine(path) {
        const text = fs.readFileSync(path, 'utf-8');
        return Array.from(text.matchAll(/\d+/gm))
            .flatMap(match => match[0])
            .map(n => parseInt(n))
        ;
    },


    /**
     * Reads a grid of integers from a file in y,x order
     * @param {string} path
     * @returns {number[][]}
     */
    readIntsGrid(path) {
        return this.readLines(path)
            .map(line => line
                .split('')
                .map(n => parseInt(n)))
        ;
    },

    /**
     * Reads a list of double-newline-delimited sections
     * @param {string} path
     * @return {string[]}
     */
    readSections(path) {
        return fs.readFileSync(path, 'utf-8')
            .split(/(?:\n|\r\n){2}/gm)
            .filter(l => l.length > 0)
        ;
    },

    /**
     * Splits a string into individual lines
     * @param {string} lines
     * @return {string[]}
     */
    splitLines(lines) {
        return lines.split(/\n|\r\n/gm)
            .filter(l => l.length > 0)
        ;
    }
};