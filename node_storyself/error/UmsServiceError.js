const RuntimeError = require('./RuntimeError');

const code = {
    loginFailed: {code: 30001, name: 'loginFailed', message: 'loginFailed'}
}

class UmsServiceError extends RuntimeError {
    constructor(errObj, additionalMessage) {
        super('UmsServiceError', errObj);
        this.additionalMessage = additionalMessage;
        
    }
}

function createErrorCodeMap() {
    const codeKeyList = Object.keys(code); 
    codeMap = {};

    for(const codeKey of codeKeyList) {
        this.codeMap[code[codeKey].code] = code[codeKey];
    }

    return codeMap;
}
/**
 * commonError: 30000
 * inventoryError: 31000
 * itemError: 32000,
 * storyError:
 */

module.exports = UmsServiceError;
module.exports.Code = code;
module.exports.CodeMap = createErrorCodeMap();