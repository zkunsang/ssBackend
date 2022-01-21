const Service = require('../service/Service');

const SSError = require('../error');
const StoryCache = require('../dbCache/StoryCache');
const { ValidType } = require('../util/ValidateUtil');

const StoryLog = require('../models/mongo/StoryLog');
const StoryLogDao = require('../daoMongo/StoryLogDao');
const User = require('../models/mongo/User');

const dbMongo = require('../dbMongo');
const shortid = require('shortid');

const Schema = {
  USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
  UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },

  UID: { key: 'uid', required: false, type: ValidType.STRING },

  STORY_LOG_LIST: { key: 'storyLostList', required: false, type: ValidType.ARRAY }
}

class StoryService extends Service {
  constructor(userInfo, updateDate) {
    super();

    const { uid } = userInfo;

    this[Schema.USER_INFO.key] = userInfo;

    this[Schema.UID.key] = uid;
    this[Schema.UPDATE_DATE.key] = updateDate;

    this[Schema.STORY_LOG_LIST.key] = [];
  }

  async ready() { }

  getUID() {
    return this[Schema.UID.key];
  }

  getUpdateDate() {
    return this[Schema.UPDATE_DATE.key];
  }

  getUserInfo() {
    return this[Schema.USER_INFO.key];
  }

  getStoryLogList() {
    return this[Schema.STORY_LOG_LIST.key];
  }

  checkStoryList(storyIdList) {
    Service.Validate.checkEmptyArray(storyIdList);
    return this.filterStoryList(storyIdList);
  }

  pushStoryLogList(item) {
    this.getStoryLogList().push(item);
  }

  filterStoryList(storyIdList) {
    const noExistStory = [];
    const existStory = [];

    for (const storyId of storyIdList) {
      const storyData = StoryCache.get(storyId);
      if (!storyData) {
        noExistStory.push(storyId);
      }
      existStory.push(storyData);
    }

    if (noExistStory.length > 0) {
      this.throwNoExistItemList(noExistStory);
    }

    return existStory;
  }



  startLog(storyId, startKey, faceList, itemList) {
    const uid = this.getUID();
    const updateDate = this.getUpdateDate();
    const type = StoryLog.StoryLogType.START;

    const storyLog = new StoryLog({ uid, storyId, updateDate, type, startKey, faceList, itemList });
    this.pushStoryLogList(storyLog);

  }

  endLog({ storyId, startKey, readTime, readPage, record, recordCurrent, forceEnd }) {
    const uid = this.getUID();
    const updateDate = this.getUpdateDate();
    const type = StoryLog.StoryLogType.END;

    const storyLog = new StoryLog({ uid, storyId, updateDate, type, startKey, readTime, readPage, record, recordCurrent, forceEnd });
    this.pushStoryLogList(storyLog);
  }

  generateStartKey() {
    return shortid.generate();
  }

  checkHasStory(storyId) {
    const userInfo = this.getUserInfo();
    const inventory = userInfo.getInventory();

    const userStory = inventory.filter((item) => item.itemId === storyId);
    return userStory.length !== 0;
  }

  async finalize() {
    const updateDate = this.getUpdateDate();
    const storyLogList = this.getStoryLogList();
    if (storyLogList.length > 0) {
      const storyLogDao = new StoryLogDao(dbMongo, updateDate);
      for (const item of storyLogList) {
        storyLogDao.insertOne(item);
      }
    }
  }

  throwAlreadyHasItem(itemId) {
    const uid = this.getUID();
    throw new SSError.Service(
      SSError.Service.Code.noExistStoryList,
      `[${uid}]: storyId(${itemId})`
    )
  }

  throwNoExistItemList(noExistStory) {
    const uid = this.getUID();
    throw new SSError.Service(
      SSError.Service.Code.noExistItemList,
      `[${uid}]: [${noExistStory.join(',')}] not exist story`)
  }

  throwNoPossessionItem(storyId) {
    const uid = this.getUID();
    throw new SSError.Service(
      SSError.Service.Code.needPurchase,
      `[${uid}]: [${storyId}] need purchase`)
  }
}

module.exports = StoryService;