const RuntimeError = require('./RuntimeError');

class ControllerError extends RuntimeError {
    constructor(errCode, errObj) {
        super('ControllerError', errCode, errObj);
    }
}

/**
 * error code: 40000
 */
module.exports = ControllerError;
module.exports.Code = {
    noExistItem: { code: 40000, name: 'noExistItem', message: 'no exist item'},
    noExistStory: { code: 40001, name: 'noExistStory', message: 'no exist story'},
}
