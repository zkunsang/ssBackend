const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const VariableKey = {
    aosAppVersion: 'aosAppVersion',
    iosAppVersion: 'iosAppVersion',
}

const Schema = {
    KEY: { key: 'key', required: true, type: ValidType.STRING },
    VALUE: { key: 'value', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ServiceVariable extends Model {
    constructor({ key, value, updateDate }) {
        super();
        this[Schema.KEY.key] = ValidateUtil.setNullUndefined(key);
        this[Schema.VALUE.key] = ValidateUtil.setNullUndefined(value);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);        
    }
};

module.exports = ServiceVariable;
module.exports.Schema = Schema;
module.exports.VariableKey = VariableKey;