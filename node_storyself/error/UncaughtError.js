const RuntimeError = require('./RuntimeError');

class UncaughtError extends RuntimeError {
    constructor(errObj) {
        super('UncaughtError', errObj);
    }
}

module.exports = UncaughtError;