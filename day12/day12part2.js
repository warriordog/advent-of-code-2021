const { parseInput } = require('./day12common.js');

// Map the cave
const caveSystem = parseInput('input.txt');

/** @typedef {import('./day12common.js').Cave} Cave */

/**
 * Generates a list of all paths from a cave to the end of the system
 * @param {Cave} from
 * @param {Map<Cave, number>} visited
 * @param {boolean} visitedSmallTwice
 * @return {string[]}
 */
function getPathsToEnd(from, visited, visitedSmallTwice) {
    // Check if we've reached the end
    if (from === caveSystem.end) {
        return [ caveSystem.end.name ];
    }

    // Prevent double-counting caves
    const visitCount = (visited.get(from) || 0) + 1;
    visited.set(from, visitCount);

    // Check if we've visited a small cave twice
    if (!from.isBig && visitCount > 1) {
        visitedSmallTwice = true;
    }

    const paths = from.connections
        // Prevent going back to start
        .filter(next => next !== caveSystem.start)

        // We can go into big caves, new caves, or the same small cave twice IF we haven't done it already
        .filter(cave => cave.isBig || !visited.has(cave) || visited.get(cave) < 1 || !visitedSmallTwice)

        // Get all paths to the end
        .flatMap(next => getPathsToEnd(next, visited, visitedSmallTwice))

        // Prepend the current cave's name (we are building backwards)
        .map(path => from.name + ',' + path)
    ;

    // Allow cave to be entered again for next path
    visited.set(from, visitCount - 1);

    return paths;
}

// Find all paths
const pathsFromStart = getPathsToEnd(caveSystem.start, new Map(), false);

// Uncomment to show paths (WARNING takes a LONG time there are almost 100K paths)
// pathsFromStart.sort();
// for (const path of pathsFromStart) {
//     console.log(path);
// }
console.log(`Day12 Part2: There are [${ pathsFromStart.length }] path(s) to the end.`);