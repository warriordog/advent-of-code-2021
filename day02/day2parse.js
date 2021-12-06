const io = require('../common/io.js');

module.exports = {
    loadInput(path) {
        return io.readLines(path)
            .map(l => l.split(' '))
            .map(line => ({
                command: line[0],
                arg: parseInt(line[1])
            }));
    }
};