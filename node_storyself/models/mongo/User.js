const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const UserStatus = ValidateUtil.UserStatus;
const Provider = ValidateUtil.Provider;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(UserStatus) },
    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    LAST_LOGIN_DATE: { key: 'lastLoginDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    POLICY_VERSION: { key: 'policyVersion', required: false, type: ValidType.STRING },
    SESSION_ID: { key: 'sessionId', required: false, type: ValidType.STRING },
    FCM_TOKEN: { key: 'fcmToken', required: false, type: ValidType.STRING },

    GOOGLE: { key: 'google', required: false, type: ValidType.STRING },
    APPLE: { key: 'apple', required: false, type: ValidType.STRING },
}

class User extends Model {
    constructor({ uid, email, status, createDate, lastLoginDate, policyVersion, sessionId, fcmToken }) {
        super();
        
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.EMAIL.key] = ValidateUtil.setNullUndefined(email);
        this[Schema.STATUS.key] = ValidateUtil.setNullUndefined(status);
        this[Schema.CREATE_DATE.key] = ValidateUtil.setNullUndefined(createDate);
        this[Schema.LAST_LOGIN_DATE.key] = ValidateUtil.setNullUndefined(lastLoginDate);
        this[Schema.POLICY_VERSION.key] = ValidateUtil.setNullUndefined(policyVersion);
        this[Schema.SESSION_ID.key] = ValidateUtil.setNullUndefined(sessionId);
        this[Schema.FCM_TOKEN.key] = ValidateUtil.setNullUndefined(fcmToken);
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }

    getUID() {
        return this[Schema.UID.key];
    }

    setSessionId(sessionId) {
        this[Schema.SESSION_ID.key] = sessionId;
    }

    setStatus(status) {
        this[Schema.STATUS.key] = status;
    }

    setLastLoginDate(lastLoginDate) {
        this[Schema.LAST_LOGIN_DATE.key] = lastLoginDate;
    }

    setPolicyVersion(policyVersion) {
        this[Schema.POLICY_VERSION.key] = policyVersion;
    }

    setCreateDate(createDate) {
        this[Schema.CREATE_DATE.key] = createDate;
    }

    setProvider(provider, providerId) {
        this[provider] = providerId;
    }
};

module.exports = User;
module.exports.Schema = Schema;
