const io = require('../common/io.js');

// Select which file to load
const INPUT_FILE = 'input.txt';

/** @typedef {{ readonly height: number, up?: Point, right?: Point, down?: Point, left?: Point, readonly x: number, readonly y: number, isInBasin: boolean }} Point */
/** @typedef {readonly (Point | undefined)[][]} Grid */
/** @typedef {Point[]} Basin */

// Read values and create unlinked points
/** @type {Grid} */
const grid = io.readLines(INPUT_FILE)
    // Read each line and track its index as the x coordinate
    .map((line, x) => line.split('')
        // Read each number and track its index as the y coordinate
        .map((numStr, y) => {
            // Parse the number into a... number
            const height = parseInt(numStr);

            // 9s don't count, so exclude them from the grid.
            // This prevents connections from being formed and speeds up the search algorithm
            if (height === 9) return undefined;

            // Create a grid point object.
            return { height, x, y, isInBasin: false };
        })
    );

/**
 * Gets the point object at a specified location.
 * If the location is out of bounds, then undefined is returned.
 * @param {number} x
 * @param {number} y
 * @returns {Point | undefined}
 */
function getPointAt(x, y) {
    const row = grid[x];
    if (row) {
        return row[y];
    } else {
        return undefined;
    }
}

// Link points
for (const row of grid) {
    for (const point of row) {
        // Skip excluded points
        if (!point) continue;

        // Create connections to the adjacent points.
        // If any point is missing or invalid, then that connection will be set to undefined.
        point.up = getPointAt(point.x, point.y + 1);
        point.down = getPointAt(point.x, point.y - 1);
        point.right = getPointAt(point.x + 1, point.y);
        point.left = getPointAt(point.x - 1, point.y);
    }
}

/**
 * Given a starting point, identify the containing basin and collect all nodes into a list.
 * The starting point can be any point within the basin - it does not need to be the lowest point.
 * A recursive flood-fill algorithm is used to find all points in the basin.
 * @param {Point} root Point to begin search
 * @returns {Basin} Returns all the points in the basin
 */
function mapBasin(root) {
    const basin = [];

    /**
     * Attempts to add the specified point to the basin.
     * If the point is not valid or already counted, then nothing happens.
     * After successfully adding a point, this function will recursively add all of its neighbors.
     * @param {Point} point
     */
    function mapBasinAt(point) {
        // Skip out-of-bounds, excluded points, and nodes that have already been processed.
        if (!point || point.isInBasin) return;

        // Add to basin
        point.isInBasin = true;
        basin.push(point);

        // Add each neighbor
        mapBasinAt(point.up);
        mapBasinAt(point.right);
        mapBasinAt(point.down);
        mapBasinAt(point.left);
    }

    // Kick off flood fill from the first point
    mapBasinAt(root);

    return basin;
}

function findAllBasins() {
    /** @type {Basin[]} */
    const basins = [];

    // Try each point
    for (const row of grid) {
        for (const point of row) {
            // Skip gaps (9s that have been excluded)
            if (!point) continue;

            // Skip points that are already in a basin
            if (point.isInBasin) continue;

            // We found a new basin
            const basin = mapBasin(point);
            basins.push(basin);
        }
    }

    return basins;
}

// Find all basins
const basins = findAllBasins();

// Sort by size
basins.sort((b1, b2) => b2.length - b1.length);

// Get the largest 3 and compute the product
const b0Size = basins[0].length;
const b1Size = basins[1].length;
const b2Size = basins[2].length;
const result = b0Size * b1Size * b2Size;
console.log(`Day9 Part2: Found [${ basins.length }] basins, the largest are [${ b0Size }], [${ b1Size }], and [${ b2Size }]. The product is [${ result }].`);