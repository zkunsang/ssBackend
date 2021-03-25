const ValidateUtil = require('../util/ValidateUtil');

const dbRedisPB = require('../dbRedisPB');
const fetch = require('node-fetch');

const AppStore = ValidateUtil.AppStore;
const ValidType = ValidateUtil.ValidType;

const SSError = require('../error');
const dbMongo = require('../dbMongo');

const Receipt = require('../models/mongo/Receipt');
const User = require('../models/mongo/User');

const ProductLog = require('../models/apilog/ProductLog');

const ReceiptDao = require('../daoMongo/ReceiptDao');
const ProductLogDao = require('../daoMongo/ProductLogDao');

const ProductCache = require('../dbCache/ProductCache');
const ProductRewardCache = require('../dbCache/ProductRewardCache');


const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    PURCHASE_DATE: { key: 'purchaseDate', required: true, type: ValidType.UNIX_TIMESTAMP },

    UID: { key: 'uid', required: false, type: ValidType.STRING },
    RECEIPT: { key: 'receipt', required: false, type: ValidType.STRING }
}


class ProductService {
    constructor(userInfo, purchaseDate) {

        const { uid } = userInfo;
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.PURCHASE_DATE.key] = purchaseDate;
        this[Schema.UID.key] = uid;

        this[Schema.RECEIPT.key] = null;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getPurchaseDate() {
        return this[Schema.PURCHASE_DATE.key];
    }

    setReceipt(receipt) {
        this[Schema.RECEIPT.key] = receipt;
    }

    getReceipt() {
        return this[Schema.RECEIPT.key];
    }

    async init() {

    }

    async validateReceipt(reqShopProduct) {
        if (reqShopProduct.getAppStore() === AppStore.GOOGLE) {
            return await this.validateReceiptGoogle(reqShopProduct);
        }
    }

    async validateReceiptGoogle(reqShopProduct) {
        const uid = this.getUID();
        // const purchaseDate = this.getPurchaseDate();

        // OAuth token획득
        const accessToken = await this.getAccessToken();

        // 구글 벨리 데이트
        const { productId, purchaseToken, packageName } = reqShopProduct;

        let url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}?access_token=${accessToken}`;
        const result = await this.checkValidate(url);

        if (result.purchaseState !== 0) {
            // throw new SSError.Service(SSError.Service.Code.nonValidGoogleReceipt, `${uid} - ${purchaseToken}`);
        }

        // 구글 영수증 샘플
        // acknowledgementState: 1
        // consumptionState: 0
        // developerPayload: '{"developerPayload":"","is_free_trial":false,"has_introductory_price_trial":false,"is_updated":false,"accountId":""}'
        // kind: 'androidpublisher#productPurchase'
        // orderId: 'GPA.3343-7169-0659-62909'
        // purchaseState: 0
        // purchaseTimeMillis: '1601283067574'
        // purchaseType: 0
        // regionCode: 'KR'

        // 영수증 검증 기록 저장(history)
        const transactionId = reqShopProduct.getTransactionId();
        const purchaseDate = reqShopProduct.getPurchaseDate();
        const purchaseState = reqShopProduct.getPurchaseState();
        const appStore = reqShopProduct.getAppStore();

        const receipt = new Receipt({ uid, productId, transactionId, purchaseDate, purchaseState, purchaseToken, packageName, appStore, purchaseDate });
        this.setReceipt(receipt);

        return receipt;
    }

    getProductId(productId) {
        return productId.split('.')[3];
    }

    async checkValidate(url) {
        const result = await fetch(url);
        return await result.json();
    }

    getAccessToken() {
        return dbRedisPB.getAccessToken();
    }

    async checkReceipt() {
        const receipt = this.getReceipt();
        const { transactionId } = receipt;

        const receiptDao = new ReceiptDao(dbMongo);
        return await receiptDao.findOne({ transactionId });
    }

    getForceProductRewardList(productId) {
        const productInfo = ProductCache.get(productId);

        if (!productInfo) {
            this.throwNoExistProduct(productId);
            return;
        }

        const productReward = ProductRewardCache.get(productId);

        if (!productReward) {
            this.throwNoExistProductReward(productId);
            return;
        }

        return productReward;
    }

    getProductRewardList() {
        const { productId } = this.getReceipt();
        return this.getForceProductRewardList(productId);
    }

    createProductLog(productInfo) {
        const uid = this.getUID();
        const purchaseDate = this.getPurchaseDate();

        const productId = productInfo.productId;
        const cost = productInfo.costKr;

        return new ProductLog({ uid, productId, cost, purchaseDate });
    }

    async finalize() {
        // 영수증 처리
        const receipt = this.getReceipt();
        const purchaseDate = this.getPurchaseDate();

        const receiptDao = new ReceiptDao(dbMongo);
        receiptDao.insertOne(receipt);

        const productInfo = ProductCache.get(productId);

        const productLog = this.createProductLog(productInfo);

        const productLogDao = new ProductLogDao(dbMongo, purchaseDate);
        await productLogDao.insertOne(productLog);

        // 로그 처리
    }

    throwNoExistProduct(productId) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.shopNoExistProduct, `[${uid}]: productId(${productId})`
        )
    }

    throwNoExistProductReward(productId) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.shopNoExistProductReward, `[${uid}]: productId(${productId})`
        )
    }
}

module.exports = ProductService;