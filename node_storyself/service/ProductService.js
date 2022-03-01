const ValidateUtil = require("../util/ValidateUtil");

const dbRedisPB = require("../dbRedisPB");
const fetch = require("node-fetch");

const ss = require("@ss");
const axios = require("axios");

const AppStore = ValidateUtil.AppStore;
const ValidType = ValidateUtil.ValidType;

const SSError = require("../error");
const dbMongo = require("../dbMongo");

const Receipt = require("../models/mongo/Receipt");
const SubscribeReceipt = require("../models/mongo/SubscribeReceipt");
const User = require("../models/mongo/User");

const ProductLog = require("../models/apilog/ProductLog");

const ReceiptDao = require("../daoMongo/ReceiptDao");
const SubscribeReceiptDao = require("../daoMongo/SubscribeReceiptDao");
const ProductLogDao = require("../daoMongo/ProductLogDao");

const ProductKeyDao = require("../daoMongo/ProductKeyDao");

const ProductCache = require("../dbCache/ProductCache");
const ProductRewardCache = require("../dbCache/ProductRewardCache");
const SubscribeInfo = require("@ss/models/mongo/SubscribeInfo");
const DateUtil = require("@ss/util/DateUtil");
const ProductKey = require('@ss/models/mongo/ProductKey');
const nanoid = require('nanoid');

const Schema = {
  USER_INFO: {
    key: "userInfo",
    required: true,
    type: ValidType.OBJECT,
    validObject: User,
  },
  PURCHASE_DATE: {
    key: "purchaseDate",
    required: true,
    type: ValidType.UNIX_TIMESTAMP,
  },

  UID: { key: "uid", required: false, type: ValidType.STRING },
  RECEIPT: { key: "receipt", required: false, type: ValidType.OBJECT },
  SUBSCRIBE_RECEIPT: {
    key: "subscribeReceipt",
    required: false,
    type: ValidType.OBJECT,
  },
  PRODUCT_ID: { key: "productId", required: false, type: ValidType.STRING },
};

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

  async init() { }

  async createProductKey(productId) {
    const uid = this.getUID();
    const productKeyDao = new ProductKeyDao(dbMongo);
    const productKeyInfo = await productKeyDao.findOne({ uid });

    const purchaseKey = nanoid(6);

    const newProductKey = purchaseKey;
    if (productKeyInfo) {
      delete productKeyInfo.uid;
      if (!productKeyInfo.productKeys[productId]) {
        productKeyInfo.productKeys[productId] = { [newProductKey]: "" };
      } else {
        productKeyInfo.productKeys[productId][newProductKey] = "";
      }

      await productKeyDao.updateOne({ uid }, productKeyInfo);
    }
    else {
      const productKeys = {
        [productId]: { [purchaseKey]: "" }
      };

      await productKeyDao.insertOne(new ProductKey({ uid, productKeys }));
    }
    // const temp = {
    //   "uid": "123", "products": [
    //     {
    //       "subscribe001": [
    //         { "purchaseKey": "GPA.123123123123" },
    //         { "purchaseKey": "" },
    //         { "purchaseKey": "" },
    //       ]
    //     }
    //   ]
    // }

    return purchaseKey;
  }

  async getProductKey(productId) {
    const uid = this.getUID();

    const productKeyDao = new ProductKeyDao(dbMongo);
    const productKeyInfo = await productKeyDao.findOne({ uid });

    if (!productKeyInfo) return null;
    if (!productKeyInfo.productKeys) return null;
    if (!productKeyInfo.productKeys[productId]) return null;

    const keyList = Object.keys(productKeyInfo.productKeys[productId]);
    for (const _productKey of keyList) {
      if (productKeyInfo.productKeys[productId][_productKey].length > 0) continue;
      return productKeyInfo.productKeys[productId][_productKey];
    }

    return null;
  }

  async updateProductKey(productId, purchaseKey, orderId) {
    const uid = this.getUID();

    const productKeyDao = new ProductKeyDao(dbMongo);
    const productKeyInfo = await productKeyDao.findOne({ uid });

    if (!productKeyInfo) return false;
    if (!productKeyInfo.productKeys) return false;
    if (!productKeyInfo.productKeys[productId]) return false;
    if (!productKeyInfo.productKeys[productId][purchaseKey]) return false;

    productKeyInfo.productKeys[productId][purchaseKey] = orderId;

    delete productKeyInfo.uid;

    await productKeyDao.updateOne({ uid }, productKeyInfo);

    return true;
  }



  cancelSubscription(originSubscribeInfo) {
    originSubscribeInfo.cancel();
    return { subscribeInfo: originSubscribeInfo };
  }

  async checkRenewReceipt() {
    const userInfo = this.getUserInfo();
    const subscribeInfo = userInfo.getSubscribeInfo();

    if (!subscribeInfo) return {};

    if (subscribeInfo.isExpireAfterCheck()) return { subscribeInfo };

    const expireDate = subscribeInfo.getExpireMillis();
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
      updateDate,
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
    });

    this.setReceipt(receipt);
    return receipt;
  }

  async validateSubscription(originSubscribeInfo) {
    let receipt = null;
    if (originSubscribeInfo.getAppStore() === AppStore.GOOGLE) {
      receipt = await this.validateSubscriptionGoogle(originSubscribeInfo);
    } else if (originSubscribeInfo.getAppStore() === AppStore.APPLE) {
      receipt = await this.validateSubscriptionApple(originSubscribeInfo);
    } else {
      receipt = this.validateSubscriptionETC(originSubscribeInfo);
    }

    if (receipt === null) return {};

    const newSubscribeInfo = new SubscribeInfo(receipt);
    newSubscribeInfo.checkExpireDate(this.getPurchaseDate());

    return { receipt, subscribeInfo: newSubscribeInfo };
  }

  validateSubscriptionETC(subscriptionInfo) {
    const uid = this.getUID();
    const { productId, purchaseToken, packageName } = subscriptionInfo;

    // 영수증 검증 기록 저장(history)

    const purchaseDate = this.getPurchaseDate();
    const purchaseState = 0;
    const appStore = subscriptionInfo.getAppStore();
    const updateDate = purchaseDate;

    const startTimeMillis = purchaseDate;
    const expiryTimeMillis = DateUtil.addMinute(purchaseDate, 5);
    const autoRenewing = true;

    const orderId = "test order Id";

    const receipt = new SubscribeReceipt({
      uid,
      productId,
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
      orderId,
    });

    this.setSubscribeReceipt(receipt);

    return receipt;
  }

  async validateSubscriptionGoogle(originSubscription) {
    const uid = this.getUID();
    const accessToken = await this.getAccessToken();
    const { productId, purchaseToken, packageName } = originSubscription;

    let url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}?access_token=${accessToken}`;
    const result = await this.checkValidate(url);

    // packageName: com.illuni.Storyself
    // productId: com.illuni.google.subscribe001

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
    const purchaseDate = this.getPurchaseDate();
    const purchaseState = result.paymentState;
    const appStore = originSubscription.getAppStore();
    const updateDate = purchaseDate;
    const { expiryTimeMillis, autoRenewing, startTimeMillis, orderId } = result;

    const receipt = new SubscribeReceipt({
      uid,
      productId,
      purchaseDate,
      purchaseState,
      purchaseToken,
      packageName,
      appStore,
      purchaseDate,
      updateDate,

      expiryTimeMillis: Number(expiryTimeMillis),
      autoRenewing,
      startTimeMillis: Number(startTimeMillis),
      orderId,
    });

    this.setSubscribeReceipt(receipt);

    return receipt;
  }

  async validateSubscriptionApple(originSubscription) {
    const u8 = new Uint8Array(originSubscription.receiptData);
    const receiptData = Buffer.from(u8).toString("base64");

    if (receiptData === null) return null;
    if (receiptData === "") return null;

    const productResult = await this.sendAppleSubscriptionProduct(receiptData);
    if (productResult.data.status === 0) {
      return this.createAppleSubscribeReceiptReceipt(
        productResult.data,
        originSubscription.receiptData
      );
    }

    if (productResult.data.status === 21007) {
      const sandboxResult = await this.sendAppleSubscriptionSandbox(
        receiptData
      );

      if (sandboxResult.data.status !== 0) return null;

      return this.createAppleSubscribeReceiptReceipt(
        sandboxResult.data,
        originSubscription.receiptData
      );
    }

    return null;
  }

  createAppleSubscribeReceiptReceipt(validateResult, receiptData) {
    // 샘플
    // "latest_receipt_info": [
    //   {
    //     "quantity": "1",
    //     "product_id": "com.illuni.live.apple.subscribe000",
    //     "transaction_id": "1000000955266779",
    //     "original_transaction_id": "1000000954921604",
    //     "purchase_date": "2022-01-24 12:21:59 Etc/GMT",
    //     "purchase_date_ms": "1643026919000",
    //     "purchase_date_pst": "2022-01-24 04:21:59 America/Los_Angeles",
    //     "original_purchase_date": "2022-01-24 06:27:02 Etc/GMT",
    //     "original_purchase_date_ms": "1643005622000",
    //     "original_purchase_date_pst": "2022-01-23 22:27:02 America/Los_Angeles",
    //     "expires_date": "2022-01-24 12:26:59 Etc/GMT",
    //     "expires_date_ms": "1643027219000",
    //     "expires_date_pst": "2022-01-24 04:26:59 America/Los_Angeles",
    //     "web_order_line_item_id": "1000000071618988",
    //     "is_trial_period": "false",
    //     "is_in_intro_offer_period": "false",
    //     "in_app_ownership_type": "PURCHASED",
    //     "subscription_group_identifier": "20912554"
    //   }
    // ],

    const latestReceiptInfo = validateResult.latest_receipt_info[0];

    const uid = this.getUID();
    const productId = latestReceiptInfo.product_id;
    const transactionId = latestReceiptInfo.transaction_id;
    const purchaseDate = Number(latestReceiptInfo.purchase_date_ms);
    const purchaseState = 0;
    const appStore = AppStore.APPLE;
    const updateDate = this.getPurchaseDate();
    const expiryTimeMillis = Number(latestReceiptInfo.expires_date_ms);
    const startTimeMillis = Number(latestReceiptInfo.purchase_date_ms);

    const receipt = new SubscribeReceipt({
      uid,
      productId,
      transactionId,
      purchaseDate,
      purchaseState,
      appStore,
      updateDate,

      expiryTimeMillis: Number(expiryTimeMillis),
      startTimeMillis: Number(startTimeMillis),
      receiptData,
    });

    this.setSubscribeReceipt(receipt);

    return receipt;
  }

  async sendAppleSubscriptionProduct(receiptData) {
    const productUrl = "https://buy.itunes.apple.com/verifyReceipt";
    return await this.checkValidatePost(productUrl, {
      "receipt-data": receiptData,
      password: ss.configs.apiServer.sharedPassword,
      "exclude-old-transactions": true,
    });
  }

  async sendAppleSubscriptionSandbox(receiptData) {
    const sandboxUrl = "https://sandbox.itunes.apple.com/verifyReceipt";
    return await this.checkValidatePost(sandboxUrl, {
      "receipt-data": receiptData,
      password: ss.configs.apiServer.sharedPassword,
      "exclude-old-transactions": true,
    });
  }

  parseProductId(productId) {
    const splitProductList = productId.split(".");
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
    if (productInfo.getProductType() === "package")
      return { productId, purchaseDate };
    return null;
  }

  async checkValidate(url) {
    const result = await fetch(url);
    return await result.json();
  }

  async checkValidatePost(url, postBody) {
    const result = await axios.post(url, postBody);
    return result;
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
    this.finalizeReceipt();
    this.finalizeSubscribe();
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
    receiptDao.insertOne(subscribeReceipt);
  }

  throwNoExistProduct(productId) {
    const uid = this.getUID();
    throw new SSError.Service(
      SSError.Service.Code.shopNoExistProduct,
      `[${uid}]: productId(${productId})`
    );
  }

  throwNoExistProductReward(productId) {
    const uid = this.getUID();
    throw new SSError.Service(
      SSError.Service.Code.shopNoExistProductReward,
      `[${uid}]: productId(${productId})`
    );
  }

  removeUnusedParams(subscribeInfo) {
    if (subscribeInfo == null) return;

    delete subscribeInfo.receiptData;
  }
}

module.exports = ProductService;
