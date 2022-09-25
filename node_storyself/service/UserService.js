const ValidateUtil = require("../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Service = require("../service/Service");
const dbMongo = require("../dbMongo");

const User = require("../models/mongo/User");
const UserDao = require("../daoMongo/UserDao");

const Schema = {
  USER_INFO: {
    key: "userInfo",
    required: true,
    type: ValidType.OBJECT,
    validObject: User,
  },
  USER_DAO: { key: "userDao", required: true, type: ValidType.OBJECT },
  NEW_USER: { key: "newUser", required: false, type: ValidType.BOOLEAN },
  CHANGE: { key: "change", required: false, type: ValidType.BOOLEAN },

  UPDATE_DATE: {
    key: "updateDate",
    required: false,
    type: ValidType.UNIX_TIMESTAMP,
  },
  INVENTORY: { key: "inventory", required: false, type: ValidType.ARRAY },
  HONEY_HISTORY: {
    key: "honeyHistory",
    required: false,
    type: ValidType.ARRAY,
  },
  PRODUCT_PURCHASE: {
    key: "productPurchase",
    required: false,
    type: ValidType.ARRAY,
  },
  MAIL: { key: "mail", required: false, type: ValidType.OBJECT },
  SMC: { key: "smc", required: false, type: ValidType.BOOLEAN },
};

class UserService extends Service {
  /**
   *
   * @param {*} userInfo
   * @param {UserDao} userDao
   * @param {*} updateDate
   */
  constructor(userInfo, userDao, updateDate) {
    super();

    // userDao는 context의 첫부분에서 항상 만든다.
    // 그래서 인자로 userDao를 넣는다
    if (!userDao) {
      userDao = new UserDao(dbMongo);
    }

    this[Schema.USER_INFO.key] = userInfo;
    this[Schema.USER_DAO.key] = userDao;
    this[Schema.UPDATE_DATE.key] = updateDate;

    this[Schema.NEW_USER.key] = false;
    this[Schema.CHANGE.key] = false;
  }

  async findUser(provider, providerId) {
    const providerInfo = {};
    providerInfo[provider] = providerId;

    const userInfo = this[Schema.USER_DAO.key].findOne(providerInfo);
    return userInfo;
  }

  async findUserWithUID(uid) {
    const userInfo = this[Schema.USER_DAO.key].findOne({ uid });
    return userInfo;
  }

  getInventory() {
    return this[Schema.USER_INFO.key][Schema.INVENTORY.key];
  }

  getMail() {
    return this[Schema.USER_INFO.key][Schema.MAIL.key];
  }

  getMailList() {
    const mailMap = this.getMail();
    return Object.values(mailMap);
  }

  getUserDao() {
    return this[Schema.USER_DAO.key];
  }

  getUserInfo() {
    return this[Schema.USER_INFO.key];
  }

  getHoneyHistory() {
    return this[Schema.USER_INFO.key][Schema.HONEY_HISTORY.key];
  }

  getProductPurhcase() {
    return this[Schema.USER_INFO.key][Schema.PRODUCT_PURCHASE.key];
  }

  getFeedback() {
    return this[Schema.USER_INFO.key].getFeedback();
  }

  getSubscriber() {
    return this[Schema.USER_INFO.key].getSubscriber();
  }

  getSubscribeCoupon() {
    return this[Schema.USER_INFO.key].getSubscribeCoupon();
  }

  addPurchaseInfo(productInfo) {
    if (!productInfo) return;
    this.setChange();
    return this[Schema.USER_INFO.key][Schema.PRODUCT_PURCHASE.key].push(
      productInfo
    );
  }

  setSMC(smc) {
    if (!smc) return;
    this.setChange();
    this[Schema.USER_INFO.key][Schema.SMC.key] = smc;
  }

  setFeedback() {
    this.setChange();
    this[Schema.USER_INFO.key].setFeedback(true);
  }

  setInventory(inventory) {
    this.setChange();
    this[Schema.USER_INFO.key][Schema.INVENTORY.key] = inventory;
  }

  setSubscriber(subId) {
    this.setChange();
    this[Schema.USER_INFO.key].setSubscriber(subId);
  }

  setSubscribeCoupon(subscribeCouponInfo) {
    this.setChange();
    this[Schema.USER_INFO.key].setSubscribeCoupon(subscribeCouponInfo);
  }

  addHoneyHistory(honeyHistory) {
    if (!honeyHistory) return;
    this.setChange();
    this[Schema.USER_INFO.key][Schema.HONEY_HISTORY.key].push(honeyHistory);
  }

  setMail(mail) {
    this.setChange();
    this[Schema.USER_INFO.key][Schema.MAIL.key] = mail;
  }

  setEtcUserMigration(provider, providerId) {
    this.setChange();
    this[Schema.USER_INFO.key].setProvider(provider, providerId);
  }

  setUserInfo(userInfo) {
    this.setChange();
    this.setIsNewUser();

    this[Schema.USER_INFO.key] = userInfo;
  }

  setIsNewUser() {
    this[Schema.NEW_USER.key] = true;
  }

  setChange() {
    this[Schema.CHANGE.key] = true;
  }

  isChange() {
    return this[Schema.CHANGE.key];
  }

  isNewUser() {
    return this[Schema.NEW_USER.key];
  }

  getItemQny(itemId) {
    const itemList = this[Schema.USER_INFO.key][Schema.INVENTORY.key];
    return itemList
      .filter((item) => itemId === item.itemId)
      .reduce((pred, item) => pred + item.itemQny, 0);
  }

  setPageSticker(pageSticker) {
    this.setChange();
    this[Schema.USER_INFO.key].setPageSticker(pageSticker);
  }

  setSubscribeInfo(subscribeInfo) {
    if (!subscribeInfo) return false;
    const userInfo = this[Schema.USER_INFO.key];

    if (userInfo.isSameSubscribeInfo(subscribeInfo)) return false;

    this.setChange();
    this[Schema.USER_INFO.key].setSubscribeInfo(subscribeInfo);

    return true;
  }

  getPageSticker(itemId) {
    if (!itemId) {
      return this[Schema.USER_INFO.key].getPageSticker();
    }

    return this[Schema.USER_INFO.key]
      .getPageSticker()
      .filter((item) => item.itemId === itemId);
  }

  deleteUser() {
    this.setChange();
    this[Schema.USER_INFO.key].setDeleted();
  }

  async linkUser(ktUserInfo) {
    const linkedUID = this[Schema.USER_INFO.key].uid;

    // 다른곳에서 연결 정보가 있다고 하면
    await this.unlinkProcess(linkedUID);
    await this.unlinkKtUser(ktUserInfo);

    const copyKTUserInfo = Object.assign({ ...ktUserInfo, linkedUID });
    const { uid: ktUID } = copyKTUserInfo;

    delete copyKTUserInfo.uid;
    delete copyKTUserInfo.email;
    delete copyKTUserInfo.createDate;

    await this.getUserDao().updateOne({ uid: ktUID }, copyKTUserInfo);

    const sourceUserInfo = this[Schema.USER_INFO.key];

    const {uid: sourceUID} = sourceUserInfo;
    const copySourceUserInfo = Object.assign({ ...sourceUserInfo, ktUID });

    delete copySourceUserInfo.uid;
    delete copySourceUserInfo.email;
    delete copySourceUserInfo.createDate;

    await this.getUserDao().updateOne({ uid: sourceUID }, copySourceUserInfo);
  }

  async unlinkProcess(linkedUID) {
    const linkedUserInfo = await this.getUserDao().findOne({ linkedUID });
    if (!!linkedUserInfo) {
      const uid = linkedUserInfo.uid;
      delete linkedUserInfo.uid;
      delete linkedUserInfo.email;
      delete linkedUserInfo.createDate;
      linkedUserInfo.linkedUID = null;
      
      await this.getUserDao().updateOne({ uid }, linkedUserInfo);
    }

    const sourceUserInfo = Object.assign({...this[Schema.USER_INFO.key]});

    if(!!sourceUserInfo.ktUID) {
      const sourceUID = sourceUserInfo.uid;
      delete sourceUserInfo.uid;
      delete sourceUserInfo.email;
      delete sourceUserInfo.createDate;
      sourceUserInfo.ktUID = null;
  
      await this.getUserDao().updateOne({ uid: sourceUID }, sourceUserInfo);
    }
  }

  async unlinkKtUser(ktUserInfo) {
    if (ktUserInfo.linkedUID) {
      const copyKtUserInfo = Object.assign({ ...ktUserInfo });
      const uid = copyKtUserInfo.uid;
      delete copyKtUserInfo.uid;
      delete copyKtUserInfo.email;
      delete copyKtUserInfo.createDate;
      copyKtUserInfo.linkedUID = null;

      await this.getUserDao().updateOne({ uid }, copyKtUserInfo);
    }

    const linkedUserInfo = await this.getUserDao().findOne({ linkedUID: ktUserInfo.linkedUID });
    if (!!linkedUserInfo) {
      const uid = linkedUserInfo.uid;
      delete linkedUserInfo.uid;
      delete linkedUserInfo.email;
      delete linkedUserInfo.createDate;
      linkedUserInfo.linkedUID = null;

      await this.getUserDao().updateOne({ uid }, linkedUserInfo);
    }
  }

  async finalize() {
    if (!this.isChange()) return false;

    if (!this.isNewUser()) {
      const copyUserInfo = Object.assign({ ...this[Schema.USER_INFO.key] });
      const { uid } = copyUserInfo;

      delete copyUserInfo.uid;
      delete copyUserInfo.email;
      delete copyUserInfo.createDate;

      await this.getUserDao().updateOne({ uid }, copyUserInfo);
    } else {
      const userInfo = this.getUserInfo();
      await this.getUserDao().insertOne(userInfo);
    }
  }


}

module.exports = UserService;
module.exports.Schema = Schema;
