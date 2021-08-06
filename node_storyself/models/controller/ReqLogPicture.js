const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    SUCCESS: { key: 'success', required: true, type: ValidType.NUMBER },
    DEBUG_LOG: { key: 'debugLog', required: true, type: ValidType.STRING },
    LOCATION: { key: 'location', required: true, type: ValidType.NUMBER },
    ERR_CODE: { key: 'errCode', required: false, type: ValidType.STRING },
    FAIL_CODE: { key: 'failCode', required: false, type: ValidType.NUMBER },
    RETRY: { key: 'retry', required: false, type: ValidType.BOOLEAN },
    PICTURE_TYPE: { key: 'pictureType', required: false, type: ValidType.NUMBER },
}

class ReqLogPicture extends Model {
    constructor({ success, location, debugLog, errCode, failCode, retry, pictureType }) {
        super();

        this[Schema.SUCCESS.key] = success;
        this[Schema.LOCATION.key] = location;
        this[Schema.DEBUG_LOG.key] = debugLog;
        this[Schema.ERR_CODE.key] = errCode;
        this[Schema.FAIL_CODE.key] = failCode;
        this[Schema.RETRY.key] = retry;
        this[Schema.PICTURE_TYPE.key] = pictureType;
    }

    getSuccess() {
        return this[Schema.SUCCESS.key];
    }

    getDebugLog() {
        return this[Schema.DEBUG_LOG.key];
    }

    getLocation() {
        return this[Schema.LOCATION.key];
    }

    getErrCode() {
        return this[Schema.ERR_CODE.key];
    }

    getFailCode() {
        return this[Schema.FAIL_CODE.key];
    }
}

module.exports = ReqLogPicture;
module.exports.Schema = Schema;