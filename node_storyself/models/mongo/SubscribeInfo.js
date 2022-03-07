const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
  APPSTORE: {
    key: "appStore",
    required: true,
    type: ValidType.STRING,
    validRange: Object.values(AppStore),
  },
  EXPIRE_MILLIS: {
    key: "expiryTimeMillis",
    required: true,
    type: ValidType.NUMBER,
  },
  START_MILLIS: {
    key: "startTimeMillis",
    required: true,
    type: ValidType.NUMBER,
  },
  AUTO_RENEW: { key: "autoRenewing", required: true, type: ValidType.BOOLEAN },
  EXPIRE_AFTER_CHECK: {
    key: "expireAfterCheck",
    required: true,
    type: ValidType.BOOLEAN,
  },

  PRODUCT_ID: { key: "productId", required: true, type: ValidType.STRING },
  PACKAGE_NAME: { key: "packageName", required: false, type: ValidType.STRING },
  PURCHASE_TOKEN: {
    key: "purchaseToken",
    required: false,
    type: ValidType.STRING,
  },
  RECEIPT_DATA: { key: "receiptData", required: false, type: ValidType.ARRAY },
};

class SubscribeInfo extends Model {
  constructor({
    startTimeMillis,
    expiryTimeMillis,
    appStore,
    autoRenewing,
    productId,
    packageName,
    purchaseToken,
    expireAfterCheck,
    receiptData,
  }) {
    super();

    this[Schema.APPSTORE.key] = appStore;
    this[Schema.START_MILLIS.key] = startTimeMillis;
    this[Schema.EXPIRE_MILLIS.key] = expiryTimeMillis;
    this[Schema.AUTO_RENEW.key] = autoRenewing;

    this[Schema.EXPIRE_AFTER_CHECK.key] = expireAfterCheck;

    this[Schema.PRODUCT_ID.key] = productId;
    this[Schema.PACKAGE_NAME.key] = packageName;
    this[Schema.PURCHASE_TOKEN.key] = purchaseToken;
    this[Schema.RECEIPT_DATA.key] = receiptData;
  }

  checkExpireDate(now) {
    this[Schema.EXPIRE_AFTER_CHECK.key] = this[Schema.EXPIRE_MILLIS.key] < now;
  }

  isExpireAfterCheck() {
    return this[Schema.EXPIRE_AFTER_CHECK.key];
  }

  getAppStore() {
    return this[Schema.APPSTORE.key];
  }

  hasSubscribe(now) {
    const isDev = process.env.NODE_ENV === 'apiDev';
    const expireDate = this[Schema.EXPIRE_MILLIS.key] + (isDev ? 180000 : 43200000);
    console.log(`${expireDate} - ${this[Schema.EXPIRE_MILLIS.key]}`);
    return expireDate > now;
  }

  getExpireMillis() {
    return this[Schema.EXPIRE_MILLIS.key];
  }

  cancel() {
    this[Schema.EXPIRE_AFTER_CHECK.key] = true;
    this[Schema.AUTO_RENEW.key] = false;
  }
}

module.exports = SubscribeInfo;
module.exports.Schema = Schema;
