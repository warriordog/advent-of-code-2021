const io = require("../common/io.js");

// Read input
const inputSections = io.readSections('input.txt');
const template = inputSections[0].split('');
const insertions = io.splitLines(inputSections[1])
    .map(line => line.split(' -> '))
    .map(parts => ({ match: parts[0], insert: parts[1] }))
;


// Set up map of pairs to counts.
// We count each pair of elements instead of each element individually.
// This allows all similar matches to be computed at the same time.
/** @type {Record<string, bigint>} */
const pairCounts = Object.create(null);

// Apply the template to set up initial state
for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];
    pairCounts[pair] = (pairCounts[pair] || 0n) + 1n;
}

// Run steps
for (let i = 0; i < 40; i++) {
    // Delay the increases until after all insertions have been processed in parallel.
    /** @type {Record<string, bigint>} */
    const increases = Object.create(null);

    // Apply each insertion
    for (const { match, insert } of insertions) {
        // Compute how many to insert
        const insertCount = pairCounts[match] || 0n;

        // Increment the 1st new match
        const newMatch1 = match.charAt(0) + insert;
        increases[newMatch1] = (increases[newMatch1] || 0n) + insertCount;

        // Increment the 2nd new match
        const newMatch2 = insert + match.charAt(1);
        increases[newMatch2] = (increases[newMatch2] || 0n) + insertCount;

        // Remove the original match (it has been destroyed by splitting)
        pairCounts[match] = 0n;
    }

    // Apply increases to the total
    for (const [key, increase] of Object.entries(increases)) {
        pairCounts[key] = (pairCounts[key] || 0n) + increase;
    }
}

// Count elements
/** @type {Record<string, bigint>} */
const elemCounts = Object.create(null);
for (const [ pair, count ] of Object.entries(pairCounts)) {
    // Increment the first element
    const elem1 = pair.charAt(0);
    elemCounts[elem1] = (elemCounts[elem1] || 0n) + count;

    // Increment the second element
    const elem2 = pair.charAt(1);
    elemCounts[elem2] = (elemCounts[elem2] || 0n) + count;
}

// Divide counts by two, because each is duplicated in pairs
for (let [ elem, count ] of Object.entries(elemCounts)) {
    if (count) {
        // Increase odd by 1 to weird off-by-one bug
        if (count % 2n === 1n) {
            count++;
        }

        // Compute correct amount
        elemCounts[elem] = count / 2n;
    }
}

// Find most and least common
const elemCountArr = Array.from(Object.entries(elemCounts))
    .sort((e1, e2) => {
        const diff = e2[1] - e1[1];
        if (diff > 0) return 1;
        if (diff < 0) return -1;
        return 0;
    })
;
const mostCommon = elemCountArr[0];
const leastCommon = elemCountArr[elemCountArr.length - 1];

// Compute answer
const result = mostCommon[1] - leastCommon[1];
console.log(`Day14 Part2: Most common element is ${ mostCommon[0] }(Q=${ mostCommon[1] }). Least common element is ${ leastCommon[0] }(Q=${ leastCommon[1] }). The difference is [${ result }].`);
