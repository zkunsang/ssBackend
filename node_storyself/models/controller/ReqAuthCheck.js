const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const Platform = ValidateUtil.Platform;

const Schema = {
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING, validRange: Object.values(Platform) },
}

class ReqAuthCheck extends Model {
    constructor({ clientVersion, platform }) {
        super();

        this[Schema.CLIENT_VERSION.key] = clientVersion;
        this[Schema.PLATFORM.key] = platform;
    }

    getClientVersion() {
        return this[Schema.CLIENT_VERSION.key];
    }

    getPlatform() {
        return this[Schema.PLATFORM.key];
    }
}

module.exports = ReqAuthCheck;
module.exports.Schema = Schema;