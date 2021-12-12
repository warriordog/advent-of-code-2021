const { parseInput } = require('./day12common.js');

const caveSystem = parseInput('test1.txt');

/** @typedef {import('./day12common.js').Cave} Cave */

class State {
    /** @param {State} [parent] */
    constructor(parent) {
        /** @type {State | undefined} */
        this._parent = parent;
        /** @type {Set<Cave> | null} */
        this._visited = null;
        /** @type {Set<Cave> | null} */
        this._visiting = null;
        /** @type {Map<Cave, string[]> | null} */
        this._memoizedPaths = null;
        /** @type {boolean | null} */
        this._visitedSmallOnce = null;
        /** @type {boolean | null} */
        this._visitedSmallTwice = null;
    }

    /**
     * @param {Cave} cave
     * @returns {boolean}
     */
    hasVisited(cave) {
        if (this._visited && this._visited.has(cave)) return true;
        if (this._parent) return this._parent.hasVisited(cave);
        return false;
    }

    /** @param {Cave} cave */
    setVisited(cave) {
        if (!this._visited) {
            this._visited = new Set();
        }

        this._visited.add(cave);
    }

    /**
     * @param {Cave} cave
     * @returns {boolean}
     */
    isVisiting(cave) {
        if (this._visiting && this._visiting.has(cave)) return true;
        if (this._parent) return this._parent.isVisiting(cave);

        return this._visiting.has(cave);
    }

    /** @param {Cave} cave */
    setVisiting(cave) {
        if (!this._visiting) {
            this._visiting = new Set();
        }

        this._visiting.add(cave);
    }

    /** @returns {boolean} */
    hasVisitedSmallOnce() {
        if (this._visitedSmallOnce === true) return true;
        if (this._parent) return this._parent.hasVisitedSmallOnce();
        return false;
    }

    setVisitedSmallOnce() {
        this._visitedSmallOnce = true;
    }

    /** @returns {boolean} */
    hasVisitedSmallTwice() {
        if (this._visitedSmallTwice === true) return true;
        if (this._parent) return this._parent.hasVisitedSmallTwice();
        return false;
    }

    setVisitedSmallTwice() {
        this._visitedSmallTwice = true;
    }

    /** @param {Cave} cave */
    hasMemoizedPath(cave) {
        if (this._memoizedPaths && this._memoizedPaths.has(cave)) return true;
        if (this._parent) return this._parent.hasMemoizedPath(cave);
        return false;
    }


    /**
     * @param {Cave} cave
     * @returns {string[] | undefined}
     */
    getMemoizedPath(cave) {
        if (this._memoizedPaths && this._memoizedPaths.has(cave)) return this._memoizedPaths.get(cave);
        if (this._parent) return this._parent.getMemoizedPath(cave);
        return undefined;
    }

    /**
     * @param {Cave} cave
     * @param {string[]} path
     */
    setMemoizedPath(cave, path) {
        if (!this._memoizedPaths) this._memoizedPaths = new Map();
        this._memoizedPaths.set(cave, path);
    }

    /** @param {Cave} cave */
    enterCave(cave) {
        // Mark as visiting
        this.setVisiting(cave);

        if (!cave.isBig) {
            // Mark small caves as visited
            this.setVisited(cave);

            // Update visitedSmallTwice flag
            if (cave !== caveSystem.start) {
                if (this.hasVisitedSmallOnce()) {
                    this.setVisitedSmallTwice();
                } else {
                    this.setVisitedSmallOnce();
                }
            }
        }
    }

    reset() {
        this._visited = null;
        this._visiting = null;
        this._memoizedPaths = null;
        this._visitedSmallOnce = null;
        this._visitedSmallTwice = null;
    }
}

/**
 * @param {Cave} to
 * @param {State} state
 * @returns {boolean}
 */
function canVisit(to, state) {
    // We cannot return to the starting room
    if (to === caveSystem.start) return false;

    // We can always visit big caves
    if (to.isBig) return true;

    // We can visit a small cave if it has never been visited
    if (!state.hasVisited(to)) return true;

    // We can visit a small cave twice IF we haven't done so already
    if (!state.hasVisitedSmallTwice()) return true;

    // Otherwise, we cannot visit
    return false;
}

/**
 * @param {Cave} from
 * @param {State} state
 * @return {string[]}
 */
function countPathsToEnd(from, state) {
    // Update state
    state.enterCave(from);

    // Use memoized path if possible
    // TODO this might not work
    if (state.hasMemoizedPath(from)) {
        return state.getMemoizedPath(from);
    }



    /** @type {string[]} */
    let paths = [];

    // Use memoized depth, if possible
    if (from.paths !== null) {
        paths = from.paths;
    }

    // If cave has no memoized depth, then compute it
    else {
        // Add each connection
        for (const next of from.connections) {
            // If next is the end, then count it as 1
            if (next === caveSystem.end) {
                // Add path
                paths.push(from.name + ',' + caveSystem.end.name);

            } else if (canVisit(next, state)) {
                // Compute its depth and add the paths
                paths = paths.concat(countPathsToEnd(next, state).map(pEnd => from.name + ',' + pEnd));
            }
        }

        // Memoize the new depth UNlESS we are already visiting upstream
        if (!state.visiting) {
            from.paths = paths;
        }
    }

    // Reset "visited" for the next path
    if (!from.isBig) {
        state.visited.delete(from);
    }

    return paths;
}

const pathsFromStart = countPathsToEnd(caveSystem.start, {
    visited: new Set(),
    visiting: new Set(),
    hasVisitedSmall: false
});
pathsFromStart.sort();
for (const path of pathsFromStart) {
    console.log(path);
}
console.log(`Day12 Part2: There are [${ pathsFromStart.length }] path(s) to the end.`);