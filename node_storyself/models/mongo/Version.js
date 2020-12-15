const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    OS_TYPE: { key: 'osType', required: true, type: ValidType.STRING },
    VERSION: { key: 'version', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP},
}

class Version extends Model {
    constructor({ osType, version, updateDate }) {
        super();
        this[Schema.OS_TYPE.key] = ValidateUtil.setNullUndefined(osType);
        this[Schema.VERSION.key] = ValidateUtil.setNullUndefined(version);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }

    getOSType() {
        return this[Schema.OS_TYPE.key];
    }
};

module.exports = Version;
module.exports.Schema = Schema;