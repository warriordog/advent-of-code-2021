const io = require('../common/io.js');

/**
 * @typedef {object} Cave A single cave within a cave system
 * @property {string} name Name of the cave
 * @property {boolean} isBig If true, the cave is "big" and can be entered more than once
 * @property {Cave[]} connections All caves that connect to this one
 * @property {string[] | null} paths Memoized list of paths to the end. Null if not computed.
 */

/**
 * @typedef {object} CaveSystem
 * @property {Map<string, Cave>} caves
 * @property {Cave} start
 * @property {Cave} end
 */

module.exports = {
    /**
     * @param {string} path
     * @returns {CaveSystem}
     */
    parseInput(path) {
        /** @type {Map<string, Cave>} */
        const caves = new Map();

        /**
         * @param {string} name
         * @returns {Cave}
         */
        function getCave(name) {
            let cave = caves.get(name);
            if (!cave) {
                cave = {
                    name,
                    isBig: /^[A-Z]\w*$/.test(name),
                    connections: [],
                    paths: null
                };
                caves.set(name, cave);
            }
            return cave;
        }

        // Populate all caves and connections
        io.readLines(path)
            .map(line => line.split('-'))
            .forEach(([name1, name2]) => {
                const cave1 = getCave(name1);
                const cave2 = getCave(name2);
                cave1.connections.push(cave2);
                cave2.connections.push(cave1);
            });

        // Get start and end caves
        const start = caves.get('start');
        const end = caves.get('end');

        // Create and return cave system
        return {caves, start, end};
    }
};