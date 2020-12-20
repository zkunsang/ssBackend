const Model = require('..')

const ValidateUtil = require('../../util/ValidateUtil')
const DateUtil = require('../../util/DateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    PROVIDER: { key: 'provider', required: false, type: ValidType.STRING },
    PROVIDER_ID: { key: 'providerId', required: false, type: ValidType.STRING },
    DEVICE_ID: { key: 'deviceId', required: false, type: ValidType.STRING },
    DEVICE_NAME: { key: 'deviceName', required: false, type: ValidType.STRING },
    OS_VERSION: { key: 'osVersion', required: false, type: ValidType.STRING },
    GAME_LANGUAGE: { key: 'gameLanguage', required: false, type: ValidType.STRING },
    PLATFORM: { key: 'platform', required: false, type: ValidType.STRING },
    APPSTORE: { key: 'appstore', required: false, type: ValidType.STRING },
    PROVIDER: { key: 'provider', required: false, type: ValidType.STRING },
    CLIENT_VERSION: { key: 'clientVersion', required: false, type: ValidType.STRING },
    

    IP: { key: 'ip', required: false, type: ValidType.STRING },
    LOGIN_DATE: { key: 'loginDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class LoginLog extends Model {
    constructor(
        { uid, deviceId, deviceName, osVersion, gameLanguage, platform, appstore, provider, clientVersion },
        { ip, loginDate }) {
        super();
        this.uid = uid;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.osVersion = osVersion;
        this.gameLanguage = gameLanguage;

        this.platform = platform;
        this.appstore = appstore;
        this.provider = provider;
        this.clientVersion = clientVersion;

        this.ip = ip;
        this.loginDate = loginDate;
        this.loginDateTZ = DateUtil.utsToDs(loginDate);
    }
}

module.exports = LoginLog;
module.exports.Schema = Schema;