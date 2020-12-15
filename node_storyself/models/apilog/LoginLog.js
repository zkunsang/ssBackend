const Model = require('..')

const ValidateUtil = require('../../util/ValidateUtil')
const DateUtil = require('../../util/DateUtil');
const ValidType = ValidateUtil.ValidType;
const moment = require('moment')


const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    DEVICE_ID: { key: 'deviceId', required: true, type: ValidType.STRING },
    DEVICE_NAME: { key: 'deviceName', required: true, type: ValidType.STRING },
    OS_VERSION: { key: 'osVersion', required: true, type: ValidType.STRING },
    GAME_LANGUAGE: { key: 'gameLanguage', required: true, type: ValidType.STRING },
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING },
    APPSTORE: { key: 'appstore', required: true, type: ValidType.STRING },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING },
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },

    IP: { key: 'ip', required: true, type: ValidType.STRING },
    LOGIN_DATE: { key: 'loginDate', required: true, type: ValidType.UNIX_TIMESTAMP },
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
        this.loginDate = moment(loginDate).format(DateUtil.DEFAULT_FORMAT);
    }
}

module.exports = LoginLog;
module.exports.Schema = Schema;