const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const Platform = ValidateUtil.Platform;

const Schema = {
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING, validRange: Object.values(Platform) },
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },
    SERVER_MESSAGE: { key: 'serverMessage', required: false, type: ValidType.STRING }
}

class ReqServiceServerMessage extends Model {
    constructor({ platform, clientVersion, serverMessage }) {
        super();
        this[Schema.PLATFORM.key] = platform;
        this[Schema.CLIENT_VERSION.key] = clientVersion;
        this[Schema.SERVER_MESSAGE.key] = serverMessage;
    }

    getPlatform() {
        return this[Schema.PLATFORM.key];
    }

    getClientVersion() {
        return this[Schema.CLIENT_VERSION.key];
    }

    getServerMessage() {
        return this[Schema.SERVER_MESSAGE.key];
    }
}

module.exports = ReqServiceServerMessage;
module.exports.Schema = Schema;
