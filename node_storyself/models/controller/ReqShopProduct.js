const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
    APPSTORE: { key: 'appStore', required: true, type: ValidType.STRING, validRange: Object.values(AppStore) },
    TRANSACTION_ID: { key: 'transactionId', required: true, type: ValidType.STRING},
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING},
    PURCHASE_DATE: { key: 'purchaseDate', required: true, type: ValidType.UNIX_TIMESTAMP},
    PURCHASE_STATE: { key: 'purchaseState', required: true, type: ValidType.NUMBER},
    PURCHASE_TOKEN: { key: 'purchaseToken', required: true, type: ValidType.STRING},
    PACKAGE_NAME: { key: 'packageName', required: true, type: ValidType.STRING}
}

class ReqShopProduct extends Model {
    constructor({ appStore, transactionId, productId, purchaseDate, purchaseState, purchaseToken, packageName }) {
        super();
        this[Schema.APPSTORE.key] = appStore;
        this[Schema.TRANSACTION_ID.key] = transactionId;
        this[Schema.PRODUCT_ID.key] = productId;
        this[Schema.PURCHASE_DATE.key] = purchaseDate;
        this[Schema.PURCHASE_STATE.key] = purchaseState;
        this[Schema.PURCHASE_TOKEN.key] = purchaseToken;
        this[Schema.PACKAGE_NAME.key] = packageName;
        
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

module.exports = ReqShopProduct;
module.exports.Schema = Schema;