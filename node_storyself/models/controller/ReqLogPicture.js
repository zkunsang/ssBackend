const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    SUCCESS: { key: 'success', required: true, type: ValidType.NUMBER },
    DEBUG_LOG: { key: 'debugLog', required: true, type: ValidType.STRING },
    LOCATION: { key: 'location', required: true, type: ValidType.NUMBER },
}

class ReqLogPicture extends Model {
    constructor({ success, location ,debugLog }) {
        super();

        this[Schema.SUCCESS.key] = success;
        this[Schema.LOCATION.key] = location;
        this[Schema.DEBUG_LOG.key] = debugLog;
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
}

module.exports = ReqLogPicture;
module.exports.Schema = Schema;