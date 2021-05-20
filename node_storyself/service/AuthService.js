const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const Provider = ValidateUtil.Provider;
const Platform = ValidateUtil.Platform;
const AppStore = ValidateUtil.AppStore;
const UserStatus = ValidateUtil.UserStatus;

const Service = require('../service/Service');
const User = require('../models/mongo/User');

const dbMongo = require('../dbMongo');
const dbRedisSS = require('../dbRedisSS');

const UserCountDao = require('../daoRedis/UserCountDao');
const LoginLogDao = require('../daoMongo/LoginLogDao');
const LoginLog = require('../models/apilog/LoginLog');

const nanoid = require('nanoid');


const Schema = {
    REQ_AUTH_LOGIN: { key: 'reqAuthLogin', required: true, type: ValidType.OBJECT },

    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING, validRange: Object.values(Provider) },
    PROVIDER_ID: { key: 'providerId', required: true, type: ValidType.STRING },
    DEVICE_ID: { key: 'deviceId', required: true, type: ValidType.STRING },
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING, validRange: Object.values(Platform) },
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },
    APPSTORE: { key: 'appStore', required: true, type: ValidType.STRING, validRange: Object.values(AppStore) },
    DEVICE_NAME: { key: 'deviceName', required: true, type: ValidType.STRING },
    GAME_LANGUAGE: { key: 'gameLanguage', required: true, type: ValidType.STRING },
    OS_VERSION: { key: 'osVersion', required: true, type: ValidType.STRING },
    FCM_TOKEN: { key: 'fcmToken', required: false, type: ValidType.STRING },

    LOGIN_DATE: { key: 'loginDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    IP: { key: "ip", required: true, type: ValidType.STRING }
}

class AuthService extends Service {
    constructor(reqAuthLogin, ip, loginDate) {
        super();

        this[Schema.REQ_AUTH_LOGIN.key] = reqAuthLogin;

        const {
            email,
            provider,
            providerId,
            deviceId,
            platform,
            clientVersion,
            appStore,
            deviceName,
            gameLanguage,
            osVersion,
            fcmToken } = reqAuthLogin;

        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
        this[Schema.PROVIDER_ID.key] = providerId;
        this[Schema.DEVICE_ID.key] = deviceId;
        this[Schema.PLATFORM.key] = platform;
        this[Schema.CLIENT_VERSION.key] = clientVersion;
        this[Schema.APPSTORE.key] = appStore;
        this[Schema.DEVICE_NAME.key] = deviceName;
        this[Schema.GAME_LANGUAGE.key] = gameLanguage;
        this[Schema.OS_VERSION.key] = osVersion;
        this[Schema.FCM_TOKEN.key] = fcmToken;
        this[Schema.LOGIN_DATE.key] = loginDate;
        this[Schema.IP.key] = ip;
    }

    finalize() {
        const loginDate = this.getLoginDate();
        const reqAuthLogin = this.getReqAuthLogin();
        const ip = this.getIP();

        const loginLog = new LoginLog(reqAuthLogin, { ip, loginDate });
        // helper.fluent.sendLog('login', loginLog);

        const loginLogDao = new LoginLogDao(dbMongo, loginDate);
        loginLogDao.insertOne(loginLog);
    }

    getIP() {
        return this[Schema.IP.key];
    }

    getReqAuthLogin() {
        return this[Schema.REQ_AUTH_LOGIN.key];
    }

    getProviderId() {
        return this[Schema.PROVIDER_ID.key];
    }

    getProvider() {
        return this[Schema.PROVIDER.key];
    }

    getLoginDate() {
        return this[Schema.LOGIN_DATE.key];
    }

    async findUser(userDao) {
        const provider = this.getProvider();
        const providerId = this.getProviderId();

        const providerInfo = {}
        providerInfo[provider] = providerId;

        return await userDao.findOne(providerInfo);
    }

    /**
     * 
     * @param {User} userInfo 
     * @param {*} sessionId 
     */
    login(userInfo, sessionId) {
        const oldSessionId = userInfo.getSessionId();
        const loginDate = this.getLoginDate();

        userInfo.setSessionId(sessionId);
        userInfo.setLastLoginDate(loginDate);

        if (!userInfo.getPUID()) {
            const puid = nanoid(10);

            console.log(`puid generated - ${puid}`);
            userInfo.setPUID(puid);
        }

        return oldSessionId;
    }

    async signIn(sessionId) {
        const userInfo = new User(this.getReqAuthLogin());

        const userCountDao = new UserCountDao(dbRedisSS);
        const userCountInfo = await userCountDao.incr();

        const uid = userCountInfo.toString();
        const loginDate = this.getLoginDate();
        const provider = this.getProvider();
        const providerId = this.getProviderId();
        const puid = nanoid(10);
        // 유저 shortId

        userInfo.setUID(uid);
        userInfo.setStatus(UserStatus.NONE);
        userInfo.setSessionId(sessionId);
        userInfo.setLastLoginDate(loginDate);
        userInfo.setCreateDate(loginDate);
        userInfo.setProvider(provider, providerId);
        userInfo.setPUID(puid)

        return userInfo;
    }
}

module.exports = AuthService;
module.exports.Schema = Schema;
