const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
  UID: { key: "uid", required: true, type: ValidType.STRING },
  PRODUCT_ID: { key: "productId", required: true, type: ValidType.STRING },
  APPSTORE: {
    key: "appStore",
    required: true,
    type: ValidType.STRING,
    validRange: Object.values(AppStore),
  },
  PURCHASE_DATE: {
    key: "purchaseDate",
    required: true,
    type: ValidType.UNIX_TIMESTAMP,
  },
  UPDATE_DATE: {
    key: "updateDate",
    required: true,
    type: ValidType.UNIX_TIMESTAMP,
  },

  PURCHASE_TOKEN: {
    key: "purchaseToken",
    required: false,
    type: ValidType.STRING,
  },
  PURCHASE_STATE: {
    key: "purchaseState",
    required: false,
    type: ValidType.NUMBER,
  },
  PACKAGE_NAME: { key: "packageName", required: false, type: ValidType.STRING },

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
  ORDER_ID: { key: "orderId", required: false, type: ValidType.STRING }, // android
  AUTO_RENEW: { key: "autoRenewing", required: false, type: ValidType.BOOLEAN }, // android
  RECEIPT_DATA: { key: "receiptData", required: false, type: ValidType.ARRAY },
};

class SubscribeReceipt extends Model {
  constructor({
    uid,
    appStore,
    productId,
    purchaseDate,
    purchaseState,
    purchaseToken,
    packageName,
    updateDate,
    expiryTimeMillis,
    autoRenewing,
    startTimeMillis,
    orderId,
    receiptData,
  }) {
    super();
    this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
    this[Schema.PRODUCT_ID.key] = ValidateUtil.setNullUndefined(productId);
    this[Schema.APPSTORE.key] = ValidateUtil.setNullUndefined(appStore);
    this[Schema.PURCHASE_TOKEN.key] =
      ValidateUtil.setNullUndefined(purchaseToken);
    this[Schema.PACKAGE_NAME.key] = ValidateUtil.setNullUndefined(packageName);
    this[Schema.PURCHASE_STATE.key] =
      ValidateUtil.setNullUndefined(purchaseState);
    this[Schema.PURCHASE_DATE.key] =
      ValidateUtil.setNullUndefined(purchaseDate);
    this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);

    this[Schema.EXPIRE_MILLIS.key] =
      ValidateUtil.setNullUndefined(expiryTimeMillis);
    this[Schema.START_MILLIS.key] =
      ValidateUtil.setNullUndefined(startTimeMillis);
    this[Schema.ORDER_ID.key] = ValidateUtil.setNullUndefined(orderId);
    this[Schema.AUTO_RENEW.key] = ValidateUtil.setNullUndefined(autoRenewing);
    this[Schema.RECEIPT_DATA.key] = ValidateUtil.setNullUndefined(receiptData);
  }

  getAppStore() {
    return this[Schema.APPSTORE.key];
  }

  getProductId() {
    return this[Schema.PRODUCT_ID.key];
  }

  getPurchaseDate() {
    return this[Schema.PURCHASE_DATE.key];
  }

  getPurchaseState() {
    return this[Schema.PURCHASE_STATE.key];
  }

  getPurchaseToken() {
    return this[Schema.PURCHASE_TOKEN.key];
  }

  getPackageName() {
    return this[Schema.PACKAGE_NAME.key];
  }
}

module.exports = SubscribeReceipt;
module.exports.Schema = Schema;
