const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    VERSION: { key: 'version', required: true, type: ValidType.STRING },
    OS_TYPE: { key: 'osType', required: true, type: ValidType.STRING },
}

class ReqVersionUpdate extends Model {
    constructor({ osType, version }) {
        super();
        this[Schema.VERSION.key] = version;
        this[Schema.OS_TYPE.key] = osType;
    }


    getOSType() {
        return this[Schema.OS_TYPE.key];
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }
}

module.exports = ReqVersionUpdate;
module.exports.Schema = Schema;
