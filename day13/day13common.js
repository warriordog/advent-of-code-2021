const io = require('../common/io.js');

/**
 * @typedef {object} Grid
 * @property {boolean[][]} dots Array of dots in y,x order
 * @property {number} xSize
 * @property {number} ySize
 */

/**
 * @typedef {object} Fold
 * @property {'x' | 'y'} axis
 * @property {number} position
 */

/**
 * @typedef {object} Input
 * @property {Grid} grid
 * @property {Fold[]} folds
 */


/**
 * @param {Grid} grid
 * @param {number} position
 */
function foldX(grid, position) {
    // Fold dots
    for (const row of grid.dots) {
        for (let i = 1; i <= position; i++) {
            // Fold the dots
            row[position - i] ||= row[position + i];
        }
        row.length = position;
    }

    // Update size
    grid.xSize = position;
}

/**
 * @param {Grid} grid
 * @param {number} position
 */
function foldY(grid, position) {
    // Fold dots
    for (let i = 1; i <= position; i++) {
        const rowTo = grid.dots[position - i];
        const rowFrom = grid.dots[position + i];
        for (let x = 0; x < grid.xSize; x++) {
            rowTo[x] ||= rowFrom[x];
        }
    }
    grid.dots.length = position;

    // Update size
    grid.ySize = position;
}

/**
 * @param {number[][]} dots
 * @returns {Grid}
 */
function createEmptyGrid(dots) {
    const width = dots.reduce((max, [x]) => Math.max(max, x), 0) + 1;
    const height = dots.reduce((max, [,y]) => Math.max(max, y), 0) + 1;

    // Create array
    const arr = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row[x] = false;
        }
        arr[y] = row;
    }

    // Create grid
    return {
        dots: arr,
        xSize: width,
        ySize: height
    };
}

/**
 *
 * @param {string} dotsInput
 * @returns {Grid}
 */
function parseGrid(dotsInput) {
    // Parse dots into (x,y) pairs
    const dots = io.splitLines(dotsInput)
        .map(dot => dot.split(',')
            .map(num => parseInt(num)));

    // Create an empty grid of the correct size
    const grid = createEmptyGrid(dots);

    // Set the active dots
    for (const [x, y] of dots) {
        grid.dots[y][x] = true;
    }

    return grid;
}

/**
 * @param {string} foldsInput
 * @return {Fold[]}
 */
function parseFolds(foldsInput) {
    return io.splitLines(foldsInput)
        .map(fold => {
            const [, axis, position] = fold.match(/fold along ([xy])=(\d+)/);
            return {
                axis: axis === 'x' ? 'x' : 'y',
                position: parseInt(position)
            };
        });
}

module.exports = {
    /**
     * @param {string} path
     * @return {Input}
     */
    parseInput(path) {
        const [ dotsInput, foldsInput ] = io.readSections(path);
        return {
            grid: parseGrid(dotsInput),
            folds: parseFolds(foldsInput)
        };
    },

    /**
     * @param {Grid} grid
     */
    printGrid(grid) {
        const gridText = grid.dots
            .map(row => row
                .map(dot => dot ? '░' : ' ')
                .join(''))
            .join('\n')
        ;
        console.log(gridText);
    },

    /**
     * Applies a fold to a grid
     * @param {Fold} fold
     * @param {Grid} grid
     */
    applyFold(fold, grid) {
        if (fold.axis === 'x') {
            foldX(grid, fold.position);
        } else {
            foldY(grid, fold.position);
        }
    }
};