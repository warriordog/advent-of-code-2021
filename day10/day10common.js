const io = require('../common/io.js');

const TYPE_OPEN = 'open';
const TYPE_CLOSE = 'close';
const TYPE_UNEXPECTED = 'unexpected';
const TYPE_END_OF_LINE = 'eol';
const TYPE_SUCCESS = 'success';

/** Maps "open" tokens to the expected "close" token */
const TOKEN_MAP = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};

/** @typedef {'open' | 'close' | 'unexpected' | 'eol' | 'success'} TokenType */
/** @typedef {{type: TokenType, char: string | null, expectedClosingTags: string[]}} Token */
/** @typedef {string[]} Input */


module.exports = {
    TYPE_OPEN: 'open',
    TYPE_CLOSE: 'close',
    TYPE_UNEXPECTED: 'unexpected',
    TYPE_END_OF_LINE: 'eol',
    TYPE_SUCCESS: 'success',

    TOKEN_MAP,

    /**
     * Reads each input line into an array of string characters
     * @param {string} path
     * @return {Input[]}
     */
    readInputs(path) {
        return io.readLines(path)
            .map(line => line.split(''))
        ;
    },

    /**
     * Processes each character of the input and yields Tokens.
     * @param {Input} input
     * @return {Generator<Token, void>}
     */
    *tokenize(input) {
        /** @type {string[]} */
        const expectedClosingTags = [];

        // Process each input character
        for (const char of input) {
            // If its an open token, then push the expected close
            if (TOKEN_MAP[char]) {
                expectedClosingTags.unshift(TOKEN_MAP[char]);
                yield { char, type: TYPE_OPEN, expectedClosingTags };
            }

            // If its NOT an open token, then check if its a valid closing token
            else {
                // If unbalanced, then this will return undefined which will correctly fail the next check.
                const expectedClosing = expectedClosingTags.shift();

                if (expectedClosing === char) {
                    // Correct closing character
                    yield { char, type: TYPE_CLOSE, expectedClosingTags };

                } else {
                    // Unexpected closing character
                    yield { char, type: TYPE_UNEXPECTED, expectedClosingTags };
                    return; // Stop processing after failure
                }
            }
        }

        // Now that we've processed all inputs, check for incomplete
        if (expectedClosingTags.length > 0) {
            // Oops, this is incomplete.
            yield { char: null, type: TYPE_END_OF_LINE, expectedClosingTags };

        } else {
            // Success! we are done.
            yield { char: null, type: TYPE_SUCCESS, expectedClosingTags };
        }
    }
};