const RuntimeError = require('./RuntimeError');
/**
 * error code 10000
 */
class ModelError extends RuntimeError {
    constructor(errObj, additionalMessage) {
        super('ModelError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;
module.exports.Code = {
    checkType: { code: 10001, name: 'checkType', message: 'check valid type' },
    requiredField: { code: 10002, name: 'requiredField', message: 'check required field' },
    validValue: { code: 10003, name: 'validValue', message: 'check valid value' },
    notValidEmail: { code: 10006, name: 'notValidEmail', message: 'check valid email' },
    notValidUnixTimeStamp: { code: 10007, name: 'notValidUnixTimeStamp', message: 'check valid unixtimestamp' },
    validRangeType: { code: 10008, name: 'validRangeType', message: 'check validRange Type' },
    validRangeValue: { code: 10009, name: 'validRangeValue', message: 'check validRange Value ' }
}