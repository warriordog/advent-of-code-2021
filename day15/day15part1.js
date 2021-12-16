const { parseInput } = require('./day15common.js');

const grid = parseInput('test.txt');
//const computedRisks = createRiskLookup(grid);

function computeIndex(x, y) {
    return (y * grid.length) + x;
}

/** @type {({ risk: number, next: number} | null)[]} */
const bestPathMap = [];
for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
        bestPathMap.push(null);
    }
}

const exitIdx = bestPathMap.length - 1;
bestPathMap[exitIdx] = { risk: 1, next: -1 };

/**
 * @param {number} x
 * @param {number} y
 * @param {number} limit
 * @param {Set<number>} visited
 * @returns {boolean}
 */
function canMoveTo(x, y, limit, visited) {
    // Check bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid.length) return false;

    // Compute move index
    const index = computeIndex(x, y);

    // Don't backtrack
    if (visited.has(index)) return false;

    // Don't exceed limit
    if (grid[y][x] > limit) return false;

    return true;
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} limit
 * @param {Set<number>} visited
 * @returns {{ risk: number, next: number} | null}
 */
function tryPath(x, y, limit, visited) {
    // Compute move info
    const index = computeIndex(x, y);
    const risk = grid[y][x];

    // Use memoized value, if present
    if (bestPathMap[index]) {
        return bestPathMap[index];
    }

    // Mark this as visited and begin exploring
    visited.add(index);

    // Find the best path
    let bestPath = null;

    // Explore right
    if (canMoveTo(x + 1, y, limit, visited)) {
        const rightRisk = grid[y][x + 1];
        const right = tryPath(x + 1, y, limit - rightRisk, visited);
        if (right && right.risk < limit) {
            limit = right.risk;
            bestPath = {
                risk: risk + right.risk,
                next: computeIndex(x + 1, y)
            };
        }
    }

    // Explore down
    if (canMoveTo(x, y + 1, limit, visited)) {
        const downRisk = grid[y + 1][x];
        const down = tryPath(x, y + 1, limit - downRisk, visited);
        if (down && down.risk < limit) {
            limit = down.risk;
            bestPath = {
                risk: risk + down.risk,
                next: computeIndex(x, y + 1)
            };
        }
    }

    // Explore left
    if (canMoveTo(x - 1, y, limit, visited)) {
        const leftRisk = grid[y][x - 1];
        const left = tryPath(x - 1, y, limit - leftRisk, visited);
        if (left && left.risk < limit) {
            limit = left.risk;
            bestPath = {
                risk: risk + left.risk,
                next: computeIndex(x - 1, y)
            };
        }
    }

    // Explore up
    if (canMoveTo(x , y - 1, limit, visited)) {
        const upRisk = grid[y - 1][x];
        const up = tryPath(x, y - 1, limit - upRisk, visited);
        if (up && up.risk < limit) {
            limit = up.risk;
            bestPath = {
                risk: risk + up.risk,
                next: computeIndex(x, y - 1)
            };
        }
    }

    // Remove from visited map and return path
    visited.delete(index);
    return bestPath;
}

function computeAt(x, y) {
    const index = (y * grid.length) + x;
    console.log(`At ${x},${y} (${index})`);

    // Skip the exit
    if (index === exitIdx) {
        return;
    }

    // Compute the path for this location
    bestPathMap[index] = tryPath(x, y, Number.MAX_SAFE_INTEGER, new Set());
}

// Bottom-right triangle
for (let m = 0; m < grid.length; m++) {
    for (let n = 0; n <= m; n++) {

        const x = (grid.length - 1) + n - m;
        const y = (grid.length - 1) - n;

        computeAt(x, y);
    }
}

// Top-left triangle
for (let m = 0; m < grid.length; m++) {
    for (let n = 0; n <= m; n++) {

        const x = m + n;
        const y = (grid.length - 1) - n;

        computeAt(x, y);
    }
}
//
// /**
//  * Computes the total risk needed to move from an x,y position to the exit
//  * @param {number} x
//  * @param {number} y
//  * @param {number[]} path
//  * @returns {import('./day15common.js').PathSegment | null}
//  */
// function getMoveFrom(x, y, path) {
//     // Used memoized risk if possible.
//     // This also covers the exit case, which is preloaded as zero.
//     const lookupIndex = computeIndex(grid, x, y);
//     if (computedRisks[lookupIndex] != null) {
//         return computedRisks[lookupIndex];
//     }
//
//     /** @type {import('./day15common.js').PathSegment[]} */
//     const possibleMoves = [];
//     function tryMove(x2, y2) {
//         // Check bounds
//         if (x2 < 0 || x2 >= grid.length || y2 < 0 || y2 >= grid.length) return;
//
//         // Compute index of move
//         const moveIndex = computeIndex(grid, x2, y2);
//
//         // Don't backtrack
//         if (path.includes(moveIndex)) return;
//
//         // This is a valid path, so test it.
//
//         // 1. Push the move onto the stack
//         path.push(moveIndex);
//
//         // 2. Compute the risk
//         const downStreamMove = getMoveFrom(x2, y2, path);
//
//         // 3. If the move is possible, then add the risk
//         if (downStreamMove !== null) {
//             possibleMoves.push({
//                 risk: grid[y2][x2] + downStreamMove.risk,
//                 path: [ moveIndex ].concat(downStreamMove.path)
//             });
//         }
//
//         // 4. Reset the stack
//         path.pop();
//     }
//
//     // Try each possible path
//     tryMove(x, y + 1);
//     tryMove(x, y - 1);
//     tryMove(x + 1, y);
//     tryMove(x - 1, y);
//
//     // Find the best path
//     /** @type {import('./day15common.js').PathSegment | null} */
//     const bestPath = possibleMoves.reduce((best, current) => {
//         if (best === null || current.risk < best.risk) return current;
//         return best;
//     }, null);
//
//     // Memoize the path
//     computedRisks[lookupIndex] = bestPath;
//
//     // Return result
//     return bestPath;
// }

//const bestMove = getMoveFrom(0, 0, [ 0 ]);

const bestMove = bestPathMap[0];
console.log(`Day15 Part1: The total risk of the best possible path is [${ bestMove.risk }].`);
