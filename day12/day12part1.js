const { parseInput } = require('./day12common.js');

// Map the cave
const caveSystem = parseInput('input.txt');

/** @typedef {import('./day12common.js').Cave} Cave */

/**
 * Generates a list of all paths from a cave to the end of the system
 * @param {Cave} from
 * @param {Set<Cave>} visited
 * @return {string[]}
 */
function getPathsToEnd(from, visited) {
    // Check if we've reached the end
    if (from === caveSystem.end) {
        return [ caveSystem.end.name ];
    }

    // Prevent double-counting caves
    visited.add(from);

    const paths = from.connections
        // Skip excluded caves
        .filter(cave => cave.isBig || !visited.has(cave))

        // Get all paths to the end
        .flatMap(next => getPathsToEnd(next, visited))

        // Prepend the current cave's name (we are building backwards)
        .map(path => from.name + ',' + path)
    ;

    // Allow cave to be entered again for next path
    visited.delete(from);

    return paths;
}

// Start mapping from the entrance
const pathsFromStart = getPathsToEnd(caveSystem.start, new Set());

// Uncomment below to show paths:
// pathsFromStart.sort();
// for (const path of pathsFromStart) {
//     console.log(path);
// }

console.log(`Day12 Part1: There are [${ pathsFromStart.length }] path(s) to the end.`);