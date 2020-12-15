const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    TRANSACTION_ID: { key: 'transactionId', required: true, type: ValidType.STRING },
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    APPSTORE: { key: 'appStore', required: true, type: ValidType.STRING, validRange: Object.values(AppStore) },
    PURCHASE_TOKEN: { key: 'purchaseToken', required: true, type: ValidType.STRING },
    PACKAGE_NAME: { key: 'packageName', required: true, type: ValidType.STRING },
    PURCHASE_STATE: { key: 'purchaseState', required: true, type: ValidType.NUMBER },
    PURCHASE_DATE: { key: 'purchaseDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class Receipt extends Model {
    constructor({ uid, appStore, transactionId, productId, purchaseDate, purchaseState, purchaseToken, packageName, updateDate }) {
        super();
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.TRANSACTION_ID.key] = ValidateUtil.setNullUndefined(transactionId);
        this[Schema.PRODUCT_ID.key] = ValidateUtil.setNullUndefined(productId);
        this[Schema.APPSTORE.key] = ValidateUtil.setNullUndefined(appStore);
        this[Schema.PURCHASE_TOKEN.key] = ValidateUtil.setNullUndefined(purchaseToken);
        this[Schema.PACKAGE_NAME.key] = ValidateUtil.setNullUndefined(packageName);
        this[Schema.PURCHASE_STATE.key] = ValidateUtil.setNullUndefined(purchaseState);
        this[Schema.PURCHASE_DATE.key] = ValidateUtil.setNullUndefined(purchaseDate);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    getAppStore() {
        return this[Schema.APPSTORE.key];
    }

    getTransactionId() {
        return this[Schema.TRANSACTION_ID.key];
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

module.exports = Receipt;
module.exports.Schema = Schema;