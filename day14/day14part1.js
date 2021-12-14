const io = require('../common/io.js');

/**
 * @typedef {object} Insertion
 * @property {string} elem1
 * @property {string} elem2
 * @property {string} newElem
 */

/**
 * @typedef {object} Polymer
 * @property {string} element
 * @property {Polymer | undefined} next
 */

/** @typedef {Record<string, Record<string, string>>} Insertions */

/**
 * @typedef {object} Input
 * @property {Polymer} template
 * @property {Insertions} insertions
 */

/**
 * @param {string} path
 * @return {Input}
 */
function parseInput(path) {
    const [ template, insertions ] = io.readSections(path);
    return {
        template: template
            .split('')
            .map(element => /** @type {Polymer} */({
                element,
                next: undefined
            }))
            .reduceRight((next, current) => {
                current.next = next;
                return current;
            }, undefined),

        insertions: io.splitLines(insertions)
            .map(i => i.split(' -> '))
            .reduce((map, [match, newElem]) => {
                const [elem1, elem2] = match.split('');
                const e2Map = map[elem1] || (map[elem1] = Object.create(null));
                e2Map[elem2] = newElem;
                return map;
            }, Object.create(null))
    };
}

/**
 *
 * @param {Polymer} polymer
 * @param {Insertions} insertions
 */
function applyInsertions(polymer, insertions) {
    for (let curr = polymer; curr !== undefined && curr.next !== undefined; curr = curr.next) {
        // Get the next element for comparison
        const next = curr.next;

        // Match the first element
        const elem1Map = insertions[curr.element];
        if (!elem1Map) continue;

        // Match the second element
        const newElem = elem1Map[next.element];
        if (!newElem) continue;

        // We matched, so insert
        curr.next = {
            element: elem1Map[next.element],
            next: next
        };

        // Skip over the new element so that we don't count it twice
        curr = curr.next;
    }
}

/**
 *
 * @param {Polymer} polymer
 * @returns {Record<string, number>}
 */
function countElements(polymer) {
    /** @type {Record<string, number>} */
    const counts = {};
    for (let curr = polymer; curr !== undefined; curr = curr.next) {
        counts[curr.element] = (counts[curr.element] || 0) + 1;
    }
    return counts;
}

// Parse the input
const { template, insertions } = parseInput('input.txt');

// Run it 10 times
for (let i = 0; i < 10; i++) {
    applyInsertions(template, insertions);
}

// Count elements
const elemCounts = countElements(template);

// Find most and least common
const elemCountArr = Array.from(Object.entries(elemCounts))
    .sort((e1, e2) => e2[1] - e1[1])
;
const mostCommon = elemCountArr[0];
const leastCommon = elemCountArr[elemCountArr.length - 1];

// Compute answer
const result = mostCommon[1] - leastCommon[1];
console.log(`Day14 Part1: Most common element is ${ mostCommon[0] }(Q=${ mostCommon[1] }). Least common element is ${ leastCommon[0] }(Q=${ leastCommon[1] }). The difference is [${ result }].`);
