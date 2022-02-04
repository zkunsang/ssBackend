const ValidateUtil = require("../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const ArrayUtil = require("@ss/util/ArrayUtil");

const Service = require("../service/Service");
const dbMongo = require("../dbMongo");

const UserResourceDao = require("../daoMongo/UserResourceDao");

const User = require("../models/mongo/User");

const Schema = {
  USER_INFO: {
    key: "userInfo",
    required: true,
    type: ValidType.OBJECT,
    validObject: User,
  },
  USER_RESOURCE_DAO: { key: "userResourceDao", required: true, type: ValidType.OBJECT },
  CHANGE: { key: "change", required: false, type: ValidType.BOOLEAN },

  USER_RESOURCE: { key: "userResource", required: false, type: ValidType.OBJECT },
};

class UserResourceService extends Service {
  constructor(userInfo) {
    super();

    // userDao는 context의 첫부분에서 항상 만든다.
    // 그래서 인자로 userDao를 넣는다
    this[Schema.USER_INFO.key] = userInfo;

    this[Schema.USER_RESOURCE_DAO.key] = new UserResourceDao(dbMongo);

    this[Schema.CHANGE.key] = false;

    this[Schema.USER_RESOURCE.key] = null;
  }

  async updateRecord(storyId, updateRecordList) {
    const userRecordList = await this.getUserRecordStoryInfo(storyId);
    const userRecordMap = ArrayUtil.keyBy(userRecordList, "fileName");

    for (const updateRecord of updateRecordList) {
      if (userRecordMap[updateRecord.fileName]) {
        userRecordMap[updateRecord.fileName].version += 1;
      } else {
        userRecordList.insert(updateRecord);
      }
    }

    return userRecordList;
  }

  getDao() {
    return this[Schema.USER_RESOURCE_DAO.key];
  }

  getUID() {
    return this[Schema.USER_INFO.key].getUID();
  }

  getUserRecordInfo(storyId) {
    if (!this[Schema.USER_RESOURCE.key]) {
      this[Schema.USER_RESOURCE.key] = {
        record: {
          [storyId]: []
        }
      };
    }

    if (!this[Schema.USER_RESOURCE.key]["record"][storyId]) {
      this[Schema.USER_RESOURCE.key]["record"] = {
        [storyId]: []
      }
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
    const uid = this.getUID()
    await this.getDao().updateOne({ uid }, this[Schema.USER_RESOURCE.key]);
  }
}

module.exports = UserResourceService;
module.exports.Schema = Schema;
