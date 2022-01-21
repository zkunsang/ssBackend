const ValidateUtil = require('../util/ValidateUtil');

const dbRedisPB = require('../dbRedisPB');
const fetch = require('node-fetch');

const AppStore = ValidateUtil.AppStore;
const ValidType = ValidateUtil.ValidType;

const SSError = require('../error');
const dbMongo = require('../dbMongo');

const Receipt = require('../models/mongo/Receipt');
const SubscribeReceipt = require('../models/mongo/SubscribeReceipt');
const User = require('../models/mongo/User');

const ProductLog = require('../models/apilog/ProductLog');

const ReceiptDao = require('../daoMongo/ReceiptDao');
const ProductLogDao = require('../daoMongo/ProductLogDao');

const ProductCache = require('../dbCache/ProductCache');
const ProductRewardCache = require('../dbCache/ProductRewardCache');
const SubscribeInfo = require('@ss/models/mongo/SubscribeInfo');


const Schema = {
  USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
  PURCHASE_DATE: { key: 'purchaseDate', required: true, type: ValidType.UNIX_TIMESTAMP },

  UID: { key: 'uid', required: false, type: ValidType.STRING },
  RECEIPT: { key: 'receipt', required: false, type: ValidType.OBJECT },
  SUBSCRIBE_RECEIPT: { key: 'subscribeReceipt', required: false, type: ValidType.OBJECT },
  PRODUCT_ID: { key: 'productId', required: false, type: ValidType.STRING },
}


class ProductService {
  constructor(userInfo, purchaseDate) {

    const { uid } = userInfo;
    this[Schema.USER_INFO.key] = userInfo;
    this[Schema.PURCHASE_DATE.key] = purchaseDate;
    this[Schema.UID.key] = uid;

    this[Schema.RECEIPT.key] = null;
    this[Schema.PRODUCT_ID.key] = null;
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

  setSubscribeReceipt(receipt) {
    this[Schema.SUBSCRIBE_RECEIPT.key] = receipt;
  }

  getReceipt() {
    return this[Schema.RECEIPT.key];
  }

  getSubscribeReceipt() {
    return this[Schema.SUBSCRIBE_RECEIPT.key];
  }

  getUserInfo() {
    return this[Schema.USER_INFO.key];
  }

  async init() {

  }

  async checkRenewReceipt() {
    const userInfo = this.getUserInfo();
    const subscribeInfo = userInfo.getSubscribeInfo();

    if (!subscribeInfo) return {};

    if (subscribeInfo.isExpireAfterCheck()) return { subscribeInfo };

    const expireDate = subscribeInfo.getExpireDate();
    const now = this.getPurchaseDate();

    if (expireDate < now) {
      return await this.validateSubscription(subscribeInfo);
    }

    return { subscribeInfo };
  }

  async validateReceipt(reqShopProduct) {
    if (reqShopProduct.getAppStore() === AppStore.GOOGLE) {
      return await this.validateReceiptGoogle(reqShopProduct);
    } else {
      return await this.validateReceiptApple(reqShopProduct);
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

    console.log(result);

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
    const updateDate = purchaseDate;

    const receipt = new Receipt({
      uid,
      productId,
      transactionId,
      purchaseDate,
      purchaseState,
      purchaseToken,
      packageName,
      appStore,
      purchaseDate,
      updateDate
    });

    this.setReceipt(receipt);

    return receipt;
  }

  async validateReceiptApple(reqShopProduct) {
    const uid = this.getUID();

    const accessToken = await this.getAccessToken();

    const productId = reqShopProduct.getProductId();
    const purchaseToken = reqShopProduct.getPurchaseToken();
    const packageName = reqShopProduct.getPackageName();

    const transactionId = reqShopProduct.getTransactionId();
    const purchaseDate = reqShopProduct.getPurchaseDate();
    const updateDate = purchaseDate;

    const appStore = reqShopProduct.getAppStore();

    //const purchaseState = reqShopProduct.getPurchaseState();
    const purchaseState = 0;

    console.log("reqShopProudct - ", reqShopProduct);

    const receipt = new Receipt({
      uid,
      productId,
      transactionId,
      purchaseDate,
      purchaseState,
      purchaseToken,
      packageName,
      appStore,
      updateDate,
    })

    this.setReceipt(receipt);
    return receipt;
  }

  async validateSubscription(subscribeInfo) {
    let receipt = null;
    if (subscribeInfo.getAppStore() === AppStore.GOOGLE) {
      receipt = await this.validateSubscriptionGoogle(subscribeInfo)
    } else {
      receipt = await this.validateSubscriptionApple(subscribeInfo);
    }

    const newSubscribeInfo = new SubscribeInfo(receipt);
    newSubscribeInfo.checkExpireDate(this.getPurchaseDate());

    return { receipt, subscribeInfo: newSubscribeInfo };
  }

  async validateSubscriptionGoogle(reqShopSubscription) {
    const uid = this.getUID();
    const accessToken = await this.getAccessToken();
    const { productId, purchaseToken, packageName } = reqShopSubscription;

    let url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}?access_token=${accessToken}`;
    console.log(`subscription url - ${url}`);
    const result = await this.checkValidate(url);

    // result.expiryTimeMillis // 만료 일자
    // result.startTimeMillis // 시작 일자
    // result.autoRenewing //:true 
    // result.orderId // GPA.3372-6633-5793-56601
    console.log(result);

    // 구글 영수증 샘플
    // acknowledgementState: 0
    // autoRenewing: true
    // countryCode: 'KR'
    // developerPayload: ''
    // expiryTimeMillis: '1642735776349'
    // kind: 'androidpublisher#subscriptionPurchase'
    // linkedPurchaseToken: 'echhflamefeejgadbhmmmflp.AO-J1OyyJwFOq5LnwlLpvxqpmJtipsgk7TOxIeTG-pDAFHqAocxq0ZtSVe6LV_YEfEviOlrGV5TPZfVcx2MiwnB_UBlUphQgzQ'
    // orderId: 'GPA.3372-6633-5793-56601'
    // paymentState: 1
    // priceAmountMicros: '11000000000'
    // priceCurrencyCode: 'KRW'
    // purchaseType: 0
    // startTimeMillis: '1642735465074'

    // 영수증 검증 기록 저장(history)
    const transactionId = reqShopSubscription.getTransactionId();
    const purchaseDate = reqShopSubscription.getPurchaseDate();
    const purchaseState = reqShopSubscription.getPurchaseState();
    const appStore = reqShopSubscription.getAppStore();
    const updateDate = purchaseDate;
    const { expiryTimeMillis, autoRenewing, startTimeMillis, orderId } = result;

    const receipt = new SubscribeReceipt({
      uid,
      productId,
      transactionId,
      purchaseDate,
      purchaseState,
      purchaseToken,
      packageName,
      appStore,
      purchaseDate,
      updateDate,

      expiryTimeMillis,
      autoRenewing,
      startTimeMillis,
      orderId
    });

    this.setSubscribeReceipt(receipt);

    return receipt;
  }

  async validateSubscriptionApple(reqShopSubscription) {

  }

  parseProductId(productId) {
    const splitProductList = productId.split('.');
    return splitProductList[splitProductList.length - 1];
  }

  setProductId(productId) {
    this[Schema.PRODUCT_ID.key] = productId;
  }

  getProductId() {
    return this[Schema.PRODUCT_ID.key];
  }

  getPurchaseInfo() {
    const productId = this.getProductId();
    const purchaseDate = this.getPurchaseDate();
    const productInfo = ProductCache.get(productId);
    if (productInfo.getProductType() === "package") return { productId, purchaseDate };
    return null;
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
    const _productId = this.parseProductId(productId);
    this.setProductId(_productId);
    return this.getForceProductRewardList(_productId);
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
    finalizeReceipt();
    finalizeSubscribe();
  }

  finalizeReceipt() {
    const receipt = this.getReceipt();
    const purchaseDate = this.getPurchaseDate();

    if (!receipt) return;
    const receiptDao = new ReceiptDao(dbMongo);
    receiptDao.insertOne(receipt);

    const { productId } = receipt;

    const productInfo = ProductCache.get(this.parseProductId(productId));

    const productLog = this.createProductLog(productInfo);

    const productLogDao = new ProductLogDao(dbMongo, purchaseDate);
    productLogDao.insertOne(productLog);
  }

  finalizeSubscribe() {
    const subscribeReceipt = this.getSubscribeReceipt();
    if (!subscribeReceipt) return;

    const receiptDao = new SubscribeReceiptDao(dbMongo);
    receiptDao.insertOne(receipt);
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