const io = require('../common/io.js');

/** @typedef {{ patterns: string[][], outputs: string[]}} Input */

// List of all possible digits for later use
const allSegments = ['a','b','c','d','e','f','g'];

// Map digit strings to number values
/** @type {Record<string, number>} */
const digitNumberMap = {
    abcefg: 0,
    cf: 1,
    acdeg: 2,
    acdfg: 3,
    bcdf: 4,
    abdfg: 5,
    abdefg: 6,
    acf: 7,
    abcdefg: 8,
    abcdfg: 9
};

/**
 * Compute / crack the digit mapping for an input
 * @param {Input} input
 * @return {Record<string, number>}
 */
function computeDecoder(input) {
    // Solve for known letters
    const pattern1 = input.patterns.find(p => p.length === 2);
    const pattern4 = input.patterns.find(p => p.length === 4);
    const pattern7 = input.patterns.find(p => p.length === 3);

    // Generate initial list of per-digit possibilities
    /** @type {Record<string, string[]>} */
    const possibleMaps = {
        a: allSegments.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && pattern7.includes(d)),
        b: allSegments.filter(d => !pattern1.includes(d) && pattern4.includes(d) && !pattern7.includes(d)),
        c: allSegments.filter(d => pattern1.includes(d) && pattern4.includes(d) && pattern7.includes(d)),
        d: allSegments.filter(d => !pattern1.includes(d) && pattern4.includes(d) && !pattern7.includes(d)),
        e: allSegments.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && !pattern7.includes(d)),
        f: allSegments.filter(d => pattern1.includes(d) && pattern4.includes(d) && pattern7.includes(d)),
        g: allSegments.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && !pattern7.includes(d)),
    };

    // Now that we've narrowed the input, we can just brute force the rest.
    /** @type {Record<string, string>[]} */
    const possibilities = [];

    function bruteForceRemainingG(a, b, c, d, e, f) {
        for (const g of possibleMaps.g) {
            if (g !== a && g !== b && g !== c && g !== d && g !== e && g !== f) {
                // Generate map and add to list
                /** @type {Record<string, string> } */
                const map = {};
                map[a] = 'a';
                map[b] = 'b';
                map[c] = 'c';
                map[d] = 'd';
                map[e] = 'e';
                map[f] = 'f';
                map[g] = 'g';
                possibilities.push(map);
            }
        }
    }
    function bruteForceRemainingF(a, b, c, d, e) {
        for (const f of possibleMaps.f) {
            if (f !== a && f !== b && f !== c && f !== d && f !== e) {
                bruteForceRemainingG(a, b, c, d, e, f);
            }
        }
    }
    function bruteForceRemainingE(a, b, c, d) {
        for (const e of possibleMaps.e) {
            if (e !== a && e !== b && e !== c && e !== d)
            bruteForceRemainingF(a, b, c, d, e);
        }
    }
    function bruteForceRemainingD(a, b, c) {
        for (const d of possibleMaps.d) {
            if (d !== a && d !== b && d !== c) {
                bruteForceRemainingE(a, b, c, d);
            }
        }
    }
    function bruteForceRemainingC(a, b) {
        for (const c of possibleMaps.c) {
            if (c !== a && c !== b) {
                bruteForceRemainingD(a, b, c);
            }
        }
    }
    function bruteForceRemainingB(a) {
        for (const b of possibleMaps.b) {
            if (b !== a) {
                bruteForceRemainingC(a, b);
            }
        }
    }
    function bruteForceRemainingA() {
        for (const a of possibleMaps.a) {
            bruteForceRemainingB(a);
        }
    }

    // Start brute forcing from digit "a"
    bruteForceRemainingA();

    // Find correct mapping
    const map = possibilities.find(map => input.patterns
        // The correct mapping is the one that decodes to a valid number for every unique input
        .every(p => digitNumberMap[p.map(d => map[d]).sort().join('')] !== undefined)
    );

    // Pivot the map
    const pivot = {};
    pivot[map.a] = 'a';
    pivot[map.b] = 'b';
    pivot[map.c] = 'c';
    pivot[map.d] = 'd';
    pivot[map.e] = 'e';
    pivot[map.f] = 'f';
    pivot[map.g] = 'g';


    // Create decoder
    /** @type {Record<string, number>} */
    const decoder = {};
    for (const [oldSegments, value] of Object.entries(digitNumberMap)) {
        const newSegments = oldSegments.split('').map(d => pivot[d]).sort().join('');
        decoder[newSegments] = value;
    }
    return decoder;
}

/**
 * @param {Input} input
 * @return {number}
 */
function decodeInput(input) {
    // Decode the mapping
    const decoder = computeDecoder(input);

    // Convert all inputs
    const numbers = input.outputs
        .map(output => String(decoder[output]))
        .join('')
    ;

    // Parse into a number
    return parseInt(numbers);
}

/** @type {Input[]} */
const inputs = io.readLines('input.txt')
    .map(entry => {
        const [ patterns, outputs ] = entry.split('|');
        return {
            patterns: patterns.trim().split(' ')
                .map(pattern => pattern.split('').sort()),
            outputs: outputs.trim().split(' ')
                .map(output => output.split('').sort().join(''))
        };
    });

// Solve all inputs and add them up
const sum = inputs.reduce((sum, input) => sum + decodeInput(input), 0);
console.log(`Day8 Part2: The output is [${ sum }].`);
