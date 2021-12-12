const { parseInput } = require('./day12common.js');

const caveSystem = parseInput('input.txt');

/** @typedef {import('./day12common.js').Cave} Cave */

/**
 * @param {Cave} from
 * @param {Set<Cave>} visited
 * @return {string[]}
 */
function countPathsToEnd(from, visited) {
    // If this is a small, cave then mark as visited
    if (!from.isBig) {
        visited.add(from);
    }

    /** @type {string[]} */
    let paths = [];

    // Add each connection
    for (const next of from.connections) {
        // If next is the end, then count it as 1
        if (next === caveSystem.end) {
            // Add path to end
            paths.push(from.name + ',' + caveSystem.end.name);

        } else {
            // Skip caves that we've already visited
            if (!visited.has(next)) {
                // Compute its depth and add the paths
                paths = paths.concat(countPathsToEnd(next, visited).map(pEnd => from.name + ',' + pEnd));
            }
        }
    }

    // Reset "visited" for the next path
    if (!from.isBig) {
        visited.delete(from);
    }

    return paths;
}

const pathsFromStart = countPathsToEnd(caveSystem.start, new Set())

// Uncomment below to show paths:
// pathsFromStart.sort();
// for (const path of pathsFromStart) {
//     console.log(path);
// }

console.log(`Day12 Part1: There are [${ pathsFromStart.length }] path(s) to the end.`);