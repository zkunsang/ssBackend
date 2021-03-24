const Service = require('../service/Service');

const SSError = require('../error');
const StoryCache = require('../dbCache/StoryCache');
const { ValidType } = require('../util/ValidateUtil');

const StoryLog = require('../models/mongo/StoryLog');
const StoryLogDao = require('../daoMongo/StoryLogDao');
const User = require('../models/mongo/User');
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
            throw new SSError.Service(SSError.Service.Code.noExistItemList, `[${noExistStory.join(',')}] not exist story`)
        }

        return existStory;
    }

    startLog(storyId) {
        const uid = this.getUID();
        const updateDate = this.getUpdateDate();
        const type = StoryLog.StoryLogType.START;

        const storyLog = new StoryLog({ uid, storyId, updateDate, type });
        this.pushStoryLogList(storyLog);

    }

    endLog(storyId) {
        const uid = this.getUID();
        const updateDate = this.getUpdateDate();
        const type = StoryLog.StoryLogType.END;

        const storyLog = new StoryLog({ uid, storyId, updateDate, type });
        this.pushStoryLogList(storyLog);
    }

    generateStartKey() {
        return shortid.generate();
    }

    checkHasStory(storyId) {
        const userInfo = this.getUserInfo();
        const inventory = userInfo.getInventory();

        inventory.map((item) => {
            if (item.itemId === storyId) {
                this.throwAlreadyHasItem(storyId);
            }

        })

    }

    async finalize() {
        const storyLogList = this.getStoryLogList();
        if (storyLogList.length > 0) {
            const storyLogDao = new StoryLogDao(ctx.$dbMongo, updateDate);
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
}

module.exports = StoryService;