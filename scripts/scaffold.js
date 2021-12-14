const fs = require("fs/promises");
const path = require('path');

function exists(path) {
    return fs.access(path)
        .then(() => true)
        .catch(() => false)
    ;
}

/**
 * @param {string} dayName
 * @return {Promise<void>}
 */
async function scaffold(dayName) {
    // Compute names
    const folderName = 'day' + dayName.padStart(2, '0');
    const filenamePrefix = 'day' + dayName;

    // Check for duplicate
    if (await exists(dayName)) {
        throw new Error(`Duplicate day: "${ dayName }"`);
    }

    // Create directory
    const dir = path.join('.', folderName);
    await fs.mkdir(dir);

    // Write common file
    const commonName = filenamePrefix + 'common.js';
    const commonPath = path.join(dir, commonName);
    const commonTemplate = `const io = require('../common/io.js');\n\nmodule.exports = {\n    /**\n     * @param {string} path\n     */\n    parseInput(path) {\n        \n    }\n};`;
    await fs.writeFile(commonPath, commonTemplate);

    // Generate part files
    const dayFileTemplate = `const { parseInput } = require('${ commonName }');\n\n`;

    // Write part 1
    const part1Path = path.join(dir, filenamePrefix + 'part1.js');
    await fs.writeFile(part1Path, dayFileTemplate);

    // Write part 2
    const part2Path = path.join(dir, filenamePrefix + 'part2.js');
    await fs.writeFile(part2Path, dayFileTemplate);

    // Write md file
    const mdPath = path.join(dir, filenamePrefix + '.md');
    const mdTemplate = `# Day ${ dayName }: TBD\n\n### Part 1\n\n\n### Part 2\n`;
    await fs.writeFile(mdPath, mdTemplate);

    // Write test file
    const testPath = path.join(dir, 'test.txt');
    await fs.writeFile(testPath, '');

    // Write input file
    const inputPath = path.join(dir, 'input.txt');
    await fs.writeFile(inputPath, '');
}

if (process.argv.length !== 3) {
    console.log('Usage: scaffold <day name>');
    process.exit(-1);
}

const day = process.argv[2];
scaffold(day)
    .then(() => console.log(`Scaffolded a new day: "${ day }".`))
    .catch(err => console.error(`Error scaffolding day "${ day }":\n`, err))
;