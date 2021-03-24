const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const MailSender = ValidateUtil.MailSender;

const Service = require('../service/Service');
const InventoryService = require('../service/InventoryService');

const dbMongo = require('../dbMongo');

const User = require('../models/mongo/User');
const UserEventDao = require('../daoMongo/UserEventDao');
const StoryEventDao = require('../daoMongo/StoryEventDao');
const MailService = require('./MailService');

class StoryEventReward {
    constructor({ storyId, eventId }, { action, addInfo, itemList }) {
        this.storyId = storyId;
        this.eventId = eventId;

        this.action = action;
        this.addInfo = addInfo;
        this.itemList = itemList;
    }

    getEventInfo() {
        return { storyId: this.storyId, eventId: this.eventId };
    }

    getRewardInfo() {
        return { action: this.action, addInfo: this.addInfo, itemList: this.itemList };
    }
}

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    USER_EVENT_DAO: { key: 'userEventDao', required: true, type: ValidType.OBJECT },
    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    UID: { key: 'uid', required: true, type: ValidType.STRING },

    STORY_EVENT_LIST: { key: 'storyEventList', required: true, type: ValidType.ARRAY }
}

class StoryEventService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {*} updateDate 
     */
    constructor(userInfo, updateDate) {
        super();

        // userDao는 context의 첫부분에서 항상 만든다.
        // 그래서 인자로 userDao를 넣는다

        const { uid } = userInfo;

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UID.key] = uid;

        this[Schema.USER_EVENT_DAO.key] = new UserEventDao(dbMongo);
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getStoryEventList() {
        return this[Schema.STORY_EVENT_LIST.key];
    }

    pushStoryEventList(item) {
        this.getStoryEventList().push(item);
    }

    async storyEvent(storyId) {
        const eventList = [];
        if ("PussInBoots" == storyId) {
            const storyEventDao = new StoryEventDao(dbMongo);;
            const eventInfo = await storyEventDao.findOne({ uid, storyId });

            if (!eventInfo) {
                const eventReward = await this.processBetaEvent(storyEventDao, storyId);
                this.pushStoryEventList(eventReward);
            }
        }

        return this.getStoryEventList();
    }


    processBetaEvent(storyId) {
        const eventId = 100;
        const itemList = [];

        const honey = InventoryService.makeInventoryObject('honey', 50);
        itemList.push(honey);

        const action = InventoryService.PUT_ACTION.EVENT.STORY_EVENT;
        const addInfo = { storyId };

        return new StoryEventReward({ storyId, eventId }, { action, addInfo, itemList });
    }

    async finalize() {
        const updateDate = this.getUpdateDate();
        const storyEventList = this.getStoryEventList();

        if (storyEventList.length > 0) {
            const storyEventDao = new StoryEventDao(dbMongo, updateDate);
            const eventList = [];
            for (const storyEvent of storyEventList) {
                const { eventInfo } = storyEvent;
                eventList.push(eventInfo);
            }

            await storyEventDao.insertMany(eventList);
        }

    }
}



module.exports = StoryEventService;
module.exports.StoryEventReward = StoryEventReward;
module.exports.Schema = Schema;
