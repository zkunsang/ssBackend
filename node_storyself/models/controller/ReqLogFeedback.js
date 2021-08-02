const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    POINT: { key: 'point', required: false, type: ValidType.NUMBER },
    DESC: { key: 'desc', required: false, type: ValidType.STRING },
    DEBUG_STRING: { key: 'debugString', required: false, type: ValidType.STRING },
}

class ReqLogFeedBack extends Model {
    constructor({ point, desc, debugString }) {
        super();

        this[Schema.POINT.key] = point;
        this[Schema.DESC.key] = desc;
        this[Schema.DEBUG_STRING.key] = debugString;
    }
}

module.exports = ReqLogFeedBack;
module.exports.Schema = Schema;