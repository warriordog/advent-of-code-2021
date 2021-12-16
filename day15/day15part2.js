const io = require('../common/io.js');
/**
 * @typedef {object} Node
 * @property {number} risk
 * @property {number} pathRisk
 * @property {boolean} visited
 * @property {Node | null} up
 * @property {Node | null} down
 * @property {Node | null} left
 * @property {Node | null} right
 * @property {Node | null} prev
 */

// Parse and expand grid
const gridNums = io.readIntsGrid('input.txt');
const initialSize = gridNums.length;
for (let y = 0; y < initialSize; y++) {
    const row1 = gridNums[y];
    for (let rY = 0; rY < 5; rY++) {
        const y2 = (rY * initialSize) + y;
        const row2 = gridNums[y2] || (gridNums[y2] = []);
        for (let x = 0; x < initialSize; x++) {
            for (let rX = 0; rX < 5; rX++) {
                // Skip 0,0 (don't project into the source)
                if (rY === 0 && rX === 0) {
                    continue;
                }

                // Compute location to project to
                const x2 = (rX * initialSize) + x;

                // Compute the new risk value
                const increase = rX + rY;
                let newRisk = row1[x] + increase;
                if (newRisk > 9) {
                    newRisk -= 9;
                }

                // Project the value
                row2[x2] = newRisk;
            }
        }
    }
}

/** @type {Node[][]} */
const grid = gridNums
    .map(row => row
        .map(risk => ({
            risk,
            pathRisk: Infinity,
            visited: false,
            up: null,
            down: null,
            left: null,
            right: null,
            prev: null
        })))
;

// Loop until we've tested everything
for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
        const node = grid[y][x];
        if (x > 0) node.left = grid[y][x - 1];
        if (x < grid.length - 1) node.right = grid[y][x + 1];
        if (y > 0) node.up = grid[y - 1][x];
        if (y < grid.length - 1) node.down = grid[y + 1][x];
    }
}

// Setup Dijkstra's algorithm
grid[0][0].pathRisk = 0;
const exit = grid[grid.length - 1][grid.length - 1];

/**
 * @param {Node} from
 * @param {Node} to
 */
function updateConnection(from, to) {
    const newRisk = from.pathRisk + to.risk;
    if (newRisk < to.pathRisk) {
        to.pathRisk = newRisk;
        to.prev = from;
    }
}

/** @type {Set<Node>} */
const nodeQueue = new Set();
nodeQueue.add(grid[0][0]);

/** @returns {Node} */
function pickNextFromQueue() {
    /** @type {Node | null} */
    let next = null;
    for (const node of nodeQueue) {
        if (next === null || node.pathRisk < next.pathRisk) {
            next = node;
        }
    }
    return next;
}

while (nodeQueue.size > 0) {
    // Stop when the exit is visited
    if (exit.visited) {
        break;
    }

    // Get next node
    const current = pickNextFromQueue();

    // Update all connections
    if (current.up && !current.up.visited) {
        updateConnection(current, current.up);
        nodeQueue.add(current.up);
    }
    if (current.down && !current.down.visited) {
        updateConnection(current, current.down);
        nodeQueue.add(current.down);
    }
    if (current.right && !current.right.visited) {
        updateConnection(current, current.right);
        nodeQueue.add(current.right);
    }
    if (current.left && !current.left.visited) {
        updateConnection(current, current.left);
        nodeQueue.add(current.left);
    }

    // Mark as visited
    current.visited = true;

    // Remove from visited AFTER complete
    nodeQueue.delete(current);
}

console.log(`Day15 Part2: The shortest distance is [${ exit.pathRisk }].`);

// Uncomment to dump the grid:
// const path = new Set();
// //path.add(grid[0][0]);
// for (let current = exit; current != null; current = current.prev) {
//     path.add(current);
// }
// const gridText = grid
//     .map(row => row
//         .map(node => path.has(node) ? `\x1b[1;32m${node.risk}\x1b[0m` : (node.visited ? String(node.risk) : `\x1b[1;31m${node.risk}\x1b[0m`))
//         .join('')
//     )
//     .join('\n')
// ;
// console.log(gridText);
