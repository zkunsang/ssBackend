const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const SubscribeInfo = require('./SubscribeInfo');
const SubscribeCoupon = require('./SubscribeCoupon');

const ValidType = ValidateUtil.ValidType;
const UserStatus = ValidateUtil.UserStatus;

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
  ETC: { key: 'etc', required: false, type: ValidType.STRING },
  KT: { key: 'kt', required: false, type: ValidType.STRING },

  INVENTORY: { key: 'inventory', required: false, type: ValidType.ARRAY },
  MAIL: { key: 'mail', required: false, type: ValidType.OBJECT },
  HONEY_HISTORY: { key: 'honeyHistory', required: false, type: ValidType.ARRAY },
  PRODUCT_PURCHASE: { key: 'productPurchase', required: false, type: ValidType.ARRAY },

  PUID: { key: 'puid', required: false, type: ValidType.STRING },
  // Story Merge Complete
  SMC: { key: 'smc', required: false, type: ValidType.BOOLEAN },

  FEEDBACK: { key: 'feedback', required: false, type: ValidType.BOOLEAN },
  // 쿠폰 구독
  SUBSCRIBER_ID: { key: 'subscriberId', required: false, type: ValidType.STRING },

  PAGE_STICKER: { key: 'pageSticker', required: false, type: ValidType.ARRAY },

  // 구독
  SUBSCRIBE_INFO: { key: 'subscribeInfo', required: false, type: ValidType.OBJECT }, 

  SUBSCRIBE_COUPON: { key: 'subscribeCoupon', required: false, type: ValidType.OBJECT },

  DELETED: { key: 'deleted', required: false, type: ValidType.BOOLEAN },
  LINKED_UID: { key: 'linkedUID', required: false, type: ValidType.STRING },
  KT_UID: { key: 'ktUID', required: false, type: ValidType.STRING },
  KT_USER: { key: 'ktUser', required: false, type: ValidType.BOOLEAN },
}

class User extends Model {
  constructor({
    uid,
    email,
    status,
    createDate,
    lastLoginDate,
    policyVersion,
    sessionId,
    fcmToken,
    inventory,
    mail,
    honeyHistory,
    puid,
    productPurchase,
    smc,
    feedback,
    subscriberId,
    pageSticker,
    subscribeInfo,
    subscribeCoupon,
    deleted,
    linkedUID,
    ktUser,
    ktUID }) {
    super();

    this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
    this[Schema.EMAIL.key] = ValidateUtil.setNullUndefined(email);
    this[Schema.STATUS.key] = ValidateUtil.setNullUndefined(status);
    this[Schema.CREATE_DATE.key] = ValidateUtil.setNullUndefined(createDate);
    this[Schema.LAST_LOGIN_DATE.key] = ValidateUtil.setNullUndefined(lastLoginDate);
    this[Schema.POLICY_VERSION.key] = ValidateUtil.setNullUndefined(policyVersion);
    this[Schema.SESSION_ID.key] = ValidateUtil.setNullUndefined(sessionId);
    this[Schema.FCM_TOKEN.key] = ValidateUtil.setNullUndefined(fcmToken);
    this[Schema.PUID.key] = ValidateUtil.setNullUndefined(puid);
    this[Schema.SMC.key] = ValidateUtil.setNullUndefined(smc);
    this[Schema.FEEDBACK.key] = ValidateUtil.setNullUndefined(feedback);
    this[Schema.SUBSCRIBER_ID.key] = ValidateUtil.setNullUndefined(subscriberId);

    this[Schema.INVENTORY.key] = inventory || [];
    this[Schema.MAIL.key] = mail || {};
    this[Schema.HONEY_HISTORY.key] = honeyHistory || [];

    this[Schema.PRODUCT_PURCHASE.key] = productPurchase || [];

    this[Schema.PAGE_STICKER.key] = pageSticker || [];
    if (subscribeInfo) {
      this[Schema.SUBSCRIBE_INFO.key] = new SubscribeInfo(subscribeInfo);
    }

    if(subscribeCoupon) {
      this[Schema.SUBSCRIBE_COUPON.key] = new SubscribeCoupon(subscribeCoupon);
    }

    this[Schema.DELETED.key] = deleted;
    this[Schema.LINKED_UID.key] = linkedUID;
    this[Schema.KT_USER.key] = ktUser;
    this[Schema.KT_UID.key] = ktUID;
  }

  getSessionId() {
    return this[Schema.SESSION_ID.key];
  }

  getUID() {
    return this[Schema.UID.key];
  }

  getInventory() {
    return this[Schema.INVENTORY.key];
  }

  getCreateDate() {
    return this[Schema.CREATE_DATE.key];
  }

  getPUID() {
    return this[Schema.PUID.key];
  }

  getEmail() {
    return this[Schema.EMAIL.key];
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

  setUID(uid) {
    this[Schema.UID.key] = uid;
  }

  setPUID(puid) {
    this[Schema.PUID.key] = puid;
  }

  setFeedback(feedback) {
    this[Schema.FEEDBACK.key] = feedback;
  }

  getFeedback() {
    return this[Schema.FEEDBACK.key];
  }

  setSubscriber(subId) {
    this[Schema.SUBSCRIBER_ID.key] = subId;
  }

  setSubscribeCoupon(subscribeCouponInfo) {
    this[Schema.SUBSCRIBE_COUPON.key] = subscribeCouponInfo;
  }
  
  getSubscriber() {
    return this[Schema.SUBSCRIBER_ID.key];
  }

  getSubscribeCoupon() {
    return this[Schema.SUBSCRIBE_COUPON.key];
  }

  setPageSticker(pageSticker) {
    this[Schema.PAGE_STICKER.key] = pageSticker;
  }

  setSubscribeInfo(subscribeInfo) {
    this[Schema.SUBSCRIBE_INFO.key] = subscribeInfo;
  }

  getSubscribeInfo() {
    return this[Schema.SUBSCRIBE_INFO.key];
  }

  isSameSubscribeInfo(subscribeInfo) {
    return this[Schema.SUBSCRIBE_INFO.key] === subscribeInfo;
  }

  getPageSticker() {
    return this[Schema.PAGE_STICKER.key];
  }

  setDeleted() {
    this[Schema.DELETED.key] = true;
  }

  getLinkUID() {
    return this[Schema.LINKED_UID.key];
  }
};

module.exports = User;
module.exports.Schema = Schema;
