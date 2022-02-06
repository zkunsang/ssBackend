const ValidateUtil = require("../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const ArrayUtil = require("@ss/util/ArrayUtil");

const Service = require("../service/Service");
const dbMongo = require("../dbMongo");

const UserResourceDao = require("../daoMongo/UserResourceDao");

const User = require("../models/mongo/User");
const UserResource = require("@ss/models/mongo/UserResource");

const Schema = {
  USER_INFO: {
    key: "userInfo",
    required: true,
    type: ValidType.OBJECT,
    validObject: User,
  },

  UPDATE_DATE: {
    key: "updateDate",
    required: false,
    type: ValidType.UNIX_TIMESTAMP,
  },

  USER_RESOURCE_DAO: {
    key: "userResourceDao",
    required: true,
    type: ValidType.OBJECT,
  },

  USER_RESOURCE: {
    key: "userResource",
    required: false,
    type: ValidType.OBJECT,
  },

  CHANGE: { key: "change", required: false, type: ValidType.BOOLEAN },
  IS_NEW: { key: "isNew", required: false, type: ValidType.BOOLEAN },
};

class UserResourceService extends Service {
  constructor(userInfo, updateDate) {
    super();

    this[Schema.USER_INFO.key] = userInfo;
    this[Schema.UPDATE_DATE.key] = updateDate;

    this[Schema.USER_RESOURCE_DAO.key] = new UserResourceDao(dbMongo);

    this[Schema.USER_RESOURCE.key] = null;

    this[Schema.CHANGE.key] = false;
    this[Schema.IS_NEW.key] = false;
  }

  async checkRecord(storyId) {
    return await this.getUserRecordStoryInfo(storyId);
  }

  async updateRecord({ storyId, updateList, deleteList, resetAll }) {
    const userRecordList = await this.getUserRecordStoryInfo(storyId);
    const userRecordMap = ArrayUtil.keyBy(userRecordList, "fileName");

    if (resetAll) {
      for (const userRecordData of userRecordList) {
        userRecordData.deleted = true;
      }
    }

    for (const updateRecord of updateList) {
      if (userRecordMap[updateRecord.fileName]) {
        userRecordMap[updateRecord.fileName].version += 1;
        userRecordMap[updateRecord.fileName].deleted = false;
        userRecordMap[updateRecord.fileName].updateDate = this.getUpdateDate();
      } else {
        updateRecord.updateDate = this.getUpdateDate();
        updateRecord.deleted = false;
        userRecordList.push(updateRecord);
      }
    }

    for (const deleteRecord of deleteList) {
      if (userRecordMap[deleteRecord.fileName]) {
        userRecordData.deleted = true;
      }
    }

    return userRecordList;
  }

  getUpdateDate() {
    return this[Schema.UPDATE_DATE.key];
  }

  getDao() {
    return this[Schema.USER_RESOURCE_DAO.key];
  }

  getUID() {
    return this[Schema.USER_INFO.key].getUID();
  }

  getUserRecordInfo(storyId) {
    if (!this[Schema.USER_RESOURCE.key]) {
      this[Schema.IS_NEW.key] = true;
      this[Schema.USER_RESOURCE.key] = {
        record: {
          [storyId]: [],
        },
      };
    }

    if (!this[Schema.USER_RESOURCE.key]["record"][storyId]) {
      this[Schema.USER_RESOURCE.key]["record"] = {
        [storyId]: [],
      };
    }

    return this[Schema.USER_RESOURCE.key]["record"][storyId];
  }

  async getUserResourceInfo() {
    const uid = this.getUID();
    if (this[Schema.USER_RESOURCE.key]) return this[Schema.USER_RESOURCE.key];

    this[Schema.USER_RESOURCE.key] = await this.getDao().findOne({ uid });
  }

  async getUserRecordStoryInfo(storyId) {
    await this.getUserResourceInfo();
    return this.getUserRecordInfo(storyId);
  }

  async finalize() {
    const uid = this.getUID();
    if (this[Schema.IS_NEW.key]) {
      await this.getDao().insertOne(
        new UserResource({ ...this[Schema.USER_RESOURCE.key], uid })
      );
    } else {
      delete this[Schema.USER_RESOURCE.key].uid;
      await this.getDao().updateOne({ uid }, this[Schema.USER_RESOURCE.key]);
    }
  }
}

module.exports = UserResourceService;
module.exports.Schema = Schema;
