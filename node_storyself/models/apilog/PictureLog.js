const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    SUCCESS: { key: 'success', required: false, type: ValidType.NUMBER },
    LOCATION: { key: 'location', required: false, type: ValidType.NUMBER },
    DEBUG_LOG: { key: 'debugLog', required: false, type: ValidType.STRING },
    ERR_CODE: { key: 'errCode', required: false, type: ValidType.STRING },
    LOG_DATE: { key: 'logDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    RETRY: { key: 'retry', required: false, type: ValidType.BOOLEAN },
}

class PictureLog extends Model {
    constructor({ uid, success, location, debugLog, logDate, errCode, retry }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.SUCCESS.key] = success;
        this[Schema.DEBUG_LOG.key] = debugLog;
        this[Schema.LOCATION.key] = location;
        this[Schema.ERR_CODE.key] = errCode;
        this[Schema.LOG_DATE.key] = logDate;
        this[Schema.RETRY.key] = retry;

        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = PictureLog;
module.exports.Schema = Schema;