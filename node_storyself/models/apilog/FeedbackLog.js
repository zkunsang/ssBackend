const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    POINT: { key: 'point', required: false, type: ValidType.NUMBER },
    DESC: { key: 'desc', required: false, type: ValidType.STRING },
    DEBUG_STRING: { key: 'debugString', required: false, type: ValidType.STRING },
}

class FeedbackLog extends Model {
    constructor({ uid, point, desc, debugString, logDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.POINT.key] = point;
        this[Schema.DESC.key] = desc;
        this[Schema.DEBUG_STRING.key] = debugString;

        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = FeedbackLog;
module.exports.Schema = Schema;