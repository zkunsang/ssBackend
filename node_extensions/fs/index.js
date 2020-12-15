const fs = require('fs-extra');
const glob = require('glob');

const fs2 = {
    globSync: (path = "", pattern = "") => {
        return glob.sync(pattern, { cwd: path });
    },
}

module.exports = Object.assign(
    {},
    fs,
    fs2
);