const io = require('../common/io.js');

/**
 * @typedef {object} Node
 * @property {number} risk
 * @property {number} pathRisk
 * @property {boolean} visited
 * @property {Node | null} up
 * @property {Node | null} down
 * @property {Node | null} left
 * @property {Node | null} right]
 */

/** @type {Node[][]} */
const grid = io.readIntsGrid('input.txt')
    .map(row => row
        .map(risk => ({
            risk,
            pathRisk: Infinity,
            visited: false,
            up: null,
            down: null,
            left: null,
            right: null
        })))
;

// Link grid nodes
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
function updatePathRisk(from, to) {
    const newRisk = from.pathRisk + to.risk;
    if (newRisk < to.pathRisk) {
        to.pathRisk = newRisk;
    }
}

/** @type {Node[]} */
const nodeQueue = [];
nodeQueue.push(grid[0][0]);

// Loop until we've tested everything
while (nodeQueue.length > 0) {
    // Stop when the exit is visited
    if (exit.visited) {
        break;
    }

    // Get the next unvisited node
    const current = nodeQueue[0];
    if (current.visited) {
        nodeQueue.shift();
        continue;
    }

    // Update risks of all connections
    if (current.up && !current.up.visited) {
        updatePathRisk(current, current.up);
        nodeQueue.push(current.up);
    }
    if (current.down) {
        updatePathRisk(current, current.down);
        nodeQueue.push(current.down);
    }
    if (current.right) {
        updatePathRisk(current, current.right);
        nodeQueue.push(current.right);
    }
    if (current.left) {
        updatePathRisk(current, current.left);
        nodeQueue.push(current.left);
    }

    current.visited = true;
    nodeQueue.shift();
}

console.log(`Day15 Part1: The shortest distance is [${ exit.pathRisk }].`);