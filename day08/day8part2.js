const io = require('../common/io.js');


/** @type {Record<number, number[]>} */
const numDigitsMap = {
    2: [1],
    3: [7],
    4: [4],
    5: [2,3,5],
    6: [0,6,9],
    7: [8]
};

/** @type {Record<number, string[]>} */
const digitSegmentMap = {
    0: ['c','f','g','a','b','e'],
    1: ['c','f'],
    2: ['c','g','a','d','e'],
    3: ['c','f','g','a','d'],
    4: ['c','f','b','d'],
    5: ['f','g','a','b','d'],
    6: ['f','a','a','b','d','e'],
    7: ['c','f','a'],
    8: ['c','f','g','a','b','d','e'],
    9: ['c','f','g','a','b','d']
};

/** @type {Record<string, number>} */
const digitNumberMap = {
    abcefg: 0,
    cf: 2,
    acdeg: 2,
    acdfg: 3,
    bcdf: 4,
    abdfg: 5,
    abdefg: 6,
    acf: 7,
    abcdefg: 8,
    abcdfg: 9
};

/** @type {Record<string, number[]>} */
const segmentDigitMap = {
    a: [0,1,2,3,4,7,8,9],
    b: [0,1,3,4,5,7,8,9],
    c: [0,2,3,5,6,8,9],
    d: [0,2,3,5,6,7,8,9],
    e: [0,4,5,6,8,9],
    f: [2,3,4,5,6,8,9],
    g: [0,2,6,8]
};

function markAsSolved(possibleMaps, solvedDigit) {
    // for (const [digit, possibleList] of Object.entries(possibleMaps)) {
    //     if (digit !== solvedDigit) {
    //         possibleMaps[digit] = possibleList.filter(d => d !== solvedDigit);
    //     }
    // }
}

function isUniqueInMap(possibleMaps, digit) {
    return Object.values(possibleMaps).filter(l => l.includes(digit)).length === 1;
}

/**
 * @param {{ patterns: string[][], outputs: string[][]}} input
 * @return {Record<string, string>}
 */
function computeDecoder(input) {
    /** @type {Record<string, string[]>} */
    const possibleMaps = {
        a: ['a','b','c','d','e','f','g'],
        b: ['a','b','c','d','e','f','g'],
        c: ['a','b','c','d','e','f','g'],
        d: ['a','b','c','d','e','f','g'],
        e: ['a','b','c','d','e','f','g'],
        f: ['a','b','c','d','e','f','g'],
        g: ['a','b','c','d','e','f','g']
    };

    // Solve for known letters
    const pattern1 = input.patterns.find(p => p.length === 2);
    const pattern4 = input.patterns.find(p => p.length === 4);
    const pattern7 = input.patterns.find(p => p.length === 3);
    possibleMaps.a = possibleMaps.a.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && pattern7.includes(d));
    possibleMaps.b = possibleMaps.b.filter(d => !pattern1.includes(d) && pattern4.includes(d) && !pattern7.includes(d));
    possibleMaps.c = possibleMaps.c.filter(d => pattern1.includes(d) && pattern4.includes(d) && pattern7.includes(d));
    possibleMaps.d = possibleMaps.d.filter(d => !pattern1.includes(d) && pattern4.includes(d) && !pattern7.includes(d));
    possibleMaps.e = possibleMaps.e.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && !pattern7.includes(d));
    possibleMaps.f = possibleMaps.f.filter(d => pattern1.includes(d) && pattern4.includes(d) && pattern7.includes(d));
    possibleMaps.g = possibleMaps.g.filter(d => !pattern1.includes(d) && !pattern4.includes(d) && !pattern7.includes(d));


    function isValidSegment(pattern) {
        const validNumbers = numDigitsMap[pattern.length];
        return validNumbers.includes(digitNumberMap[pattern]);
    }

    function ifValidSolution(map) {
        for (const pattern of input.patterns) {
            const translatedPattern = pattern.map(d => map[d]).join('');
            if (!isValidSegment(translatedPattern)) {
                return false;
            }
        }
        return true;
    }

    function bruteForceRemainingG(a, b, c, d, e, f) {
        for (const g of possibleMaps.g.filter(g => g !== a && g !== b && g !== c && g !== d && g !== e && g !== f)) {
            // Check solution
            const map = { a, b, c, d, e, f, g };
            const pivot = {};
            pivot[map.a] = 'a';
            pivot[map.b] = 'b';
            pivot[map.c] = 'c';
            pivot[map.d] = 'd';
            pivot[map.e] = 'e';
            pivot[map.f] = 'f';
            pivot[map.g] = 'g';
            console.log(pivot);
            if (ifValidSolution(pivot)) {
                // Update possible maps
                return map;
            }
        }
        return null;
    }
    function bruteForceRemainingF(a, b, c, d, e) {
        for (const f of possibleMaps.f.filter(f => f !== a && f !== b && f !== c && f !== d && f !== e)) {
            const result = bruteForceRemainingG(a, b, c, d, e, f);
            if (result) {
                return result;
            }
        }
        return null;
    }
    function bruteForceRemainingE(a, b, c, d) {
        for (const e of possibleMaps.e.filter(e => e !== a && e !== b && e !== c && e !== d)) {
            const result = bruteForceRemainingF(a, b, c, d, e);
            if (result) {
                return result;
            }
        }
        return null;
    }
    function bruteForceRemainingD(a, b, c) {
        for (const d of possibleMaps.d.filter(d => d !== a && d !== b && d !== c)) {
            const result = bruteForceRemainingE(a, b, c, d);
            if (result) {
                return result;
            }
        }
        return null;
    }
    function bruteForceRemainingC(a, b) {
        for (const c of possibleMaps.c.filter(c => c !== a && c !== b)) {
            const result = bruteForceRemainingD(a, b, c);
            if (result) {
                return result;
            }
        }
        return null;
    }
    function bruteForceRemainingB(a) {
        for (const b of possibleMaps.b.filter(b => b !== a)) {
            const result = bruteForceRemainingC(a, b);
            if (result) {
                return result;
            }
        }
        return null;
    }
    function bruteForceRemainingA() {
        for (const a of possibleMaps.a) {
            const result = bruteForceRemainingB(a);
            if (result) {
                return result;
            }
        }
        return null;
    }
    return bruteForceRemainingA();

    // NOTES:
    // This wont work, the digitSegmentMap is in absolute terms.
    // New solution: recursive brute force remaining options

    // Scan through each reading to further narrow the values
    // for (const reading of input.patterns.concat(input.outputs)) {
    //     // Get the list of valid numbers based on length
    //     const validNums = numDigitsMap[reading.length];
    //
    //     // Get the list of allowed digits based on valid numbers
    //     const allowedDigits = validNums.flatMap(n => digitSegmentMap[n]);
    //
    //     // Scan through each digit in the reading
    //     for (const digit of reading) {
    //         // Filter the remaining list based on allowed digits
    //         possibleMaps[digit] = possibleMaps[digit].filter(d => allowedDigits.includes(d));
    //
    //         // If solved, then remove from the list
    //         // if (possibleMaps[digit].length === 1) {
    //         //     markAsSolved(possibleMaps, possibleMaps[digit]);
    //         // }
    //
    //         // Check if we solved any letters
    //         // for (const entry of Object.entries(possibleMaps)) {
    //         //     if (entry[1].length > 1) {
    //         //         const solution = entry[1].find(d => isUniqueInMap(possibleMaps, d));
    //         //         if (solution) {
    //         //             possibleMaps[entry[0]] = [solution];
    //         //         }
    //         //         markAsSolved(possibleMaps, entry[0]);
    //         //     }
    //         // }
    //     }
    // }

    // Compact any solved letters
    for (const solvedKey of ['a','b','c','d','e','f','g'].filter(d => possibleMaps[d].length === 1)) {
        const solvedValue = possibleMaps[solvedKey][0];

        // Compare against all other digits
        for (const otherDigit of ['a','b','c','d','e','f','g'].filter(d => d !== solvedKey)) {
            possibleMaps[otherDigit] = possibleMaps[otherDigit].filter(d => d !== solvedValue);
        }
    }
    let changed = false;
    do {
        changed = false;
        for (const digit of ['a','b','c','d','e','f','g']) {
            if (possibleMaps[digit].length === 1) {
                const solution = possibleMaps[digit][0];
                Object.keys(possibleMaps).filter(d => d !== digit).forEach(d => {
                    const solutionIdx = possibleMaps[d].indexOf(solution);
                    if (solutionIdx > -1) {
                        changed = true;
                        possibleMaps[d].splice(solutionIdx, 1);
                    }
                });
            }
        }
    } while (changed);

    // Flatten the mapping
    return {
        a: possibleMaps.a[0],
        b: possibleMaps.b[0],
        c: possibleMaps.c[0],
        d: possibleMaps.d[0],
        e: possibleMaps.e[0],
        f: possibleMaps.f[0],
        g: possibleMaps.g[0]
    };
}

/*
a=>d
b=>e
c=>a
d=>f
e=>g
f=>b
g=>c
 */

/**
 * @param {{ patterns: string[][], outputs: string[][]}} input
 * @return {number}
 */
function decodeInput(input) {
    const decoder = computeDecoder(input);

    const numbers = input.outputs
        .map(output => output.map(d => decoder[d]))
        .map(output => digitNumberMap[output.join('')])
        .map(num => String(num))
        .join('')
    ;

    return parseInt(numbers);
}

/** @type {{ patterns: string[][], outputs: string[][]}[]} */
const inputs = io.readLines('test.txt')
    .map(entry => {
        const [ patterns, outputs ] = entry.split('|');
        return {
            patterns: patterns.trim().split(' ')
                .map(pattern => pattern.split('').sort()),
            outputs: outputs.trim().split(' ')
                .map(output => output.split('').sort())
        };
    });

const sum = inputs.reduce((sum, input) => sum + decodeInput(input), 0);
console.log(`Day8 Part2: The answer is ${ sum }.`);
