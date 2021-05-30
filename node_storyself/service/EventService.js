const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const MailSender = ValidateUtil.MailSender;

const Service = require('../service/Service');
const InventoryService = require('../service/InventoryService');

const dbMongo = require('../dbMongo');

const User = require('../models/mongo/User');
const UserEvent = require('../models/mongo/UserEvent');
const UserEventDao = require('../daoMongo/UserEventDao');


const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    USER_EVENT_DAO: { key: 'userEventDao', required: true, type: ValidType.OBJECT },
    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    UID: { key: 'uid', required: true, type: ValidType.STRING },

    EVENT_CHECK_LIST: { key: 'eventCheckList', required: true, type: ValidType.ARRAY },
    USER_EVENT_INFO: { key: 'userEventInfo', required: false, type: ValidType.OBJECT },
}

class EventReward {
    constructor({ eventId }, { action, addInfo, itemList }) {
        this.eventId = eventId;

        this.action = action;
        this.addInfo = addInfo;
        this.itemList = itemList;
    }

    getEventInfo() {
        return { eventId: this.eventId };
    }

    getRewardInfo() {
        return { action: this.action, addInfo: this.addInfo, itemList: this.itemList };
    }
}

class EventService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {*} updateDate 
     */
    constructor(userInfo, updateDate) {
        super();

        const { uid } = userInfo;

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UID.key] = uid;

        this[Schema.USER_EVENT_DAO.key] = new UserEventDao(dbMongo);
        this[Schema.UPDATE_DATE.key] = updateDate;

        this[Schema.EVENT_CHECK_LIST.key] = [];
        this[Schema.USER_EVENT_INFO.key] = null;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getEventCheckList() {
        return this[Schema.EVENT_CHECK_LIST.key];
    }

    getUserEventDao() {
        return this[Schema.USER_EVENT_DAO.key];
    }

    getUserEventInfo() {
        return this[Schema.USER_EVENT_INFO.key];
    }

    pushEventCheckList(item) {
        this.getEventCheckList().push(item);
    }

    setUserEventInfo(userEventInfo) {
        this[Schema.USER_EVENT_INFO.key] = userEventInfo;
    }

    newUserEvent() {
        // 신규 유저 지급 아이템 리스트 생성
        const itemList = [];
        const pictureSlot = { itemId: 'pictureSlot', itemQny: 1 };
        itemList.push(pictureSlot);

        const honey = { itemId: 'honey', itemQny: 25 };
        itemList.push(honey);

        // const goldi = { itemId: 'PussInBoots', itemQny: 1 };
        // itemList.push(goldi);

        // 신규 이벤트 처리
        return itemList;
    }

    async checkEvent() {
        // TODO: 임시 이벤트
        // 이벤트 리스트에서 이벤트들을 확인
        const eventId = "1";
        const uid = this.getUID();

        const userEventInfo = await this.getUserEventDao().findOne({ uid });
        this.setUserEventInfo(userEventInfo);

        if (userEventInfo && userEventInfo.hasEventInfo(eventId)) return;

        const eventInfo = { eventId };

        const action = InventoryService.PUT_ACTION.EVENT.TEMP_EVENT;
        const addInfo = { eventInfo };
        const itemList = [{ itemId: 'honey', itemQny: 25 }];

        const eventItemList = [
            new EventReward({ eventId }, { action, addInfo, itemList })
        ];

        const title = '스토리셀프에 오신걸 환영합니다!';
        const message = '온 가족이 동화 속 주인공이 되는 스토리셀프! 스토리셀프에 오신걸 환영합니다!<br>다양한 스토리 세계로 여행을 떠나봐요.';

        const sender = MailSender.EVENT;
        const senderId = eventId;
        // const emailItemList = [{ itemId: 'honey', itemQny: 3 }];
        const emailItemList = [];

        const itemInfo = {
            action: InventoryService.PUT_ACTION.EVENT.TEMP_EVENT,
            addInfo: { eventId },
        };

        const eventMailList = [
            { title, message, sender, senderId, itemList: emailItemList, itemInfo }
        ];

        this.pushEventCheckList(eventInfo);

        return { eventItemList, eventMailList };
    }

    async finalize() {
        const eventCheckList = this.getEventCheckList();
        const updateDate = this.getUpdateDate();
        const uid = this.getUID();

        let userEventInfo = this.getUserEventInfo();
        let isInsert = false;

        if (!userEventInfo) {
            isInsert = true;
            const eventInfo = {};

            userEventInfo = new UserEvent({ uid, eventInfo });
        }

        if (eventCheckList.length > 0) {
            for (const eventCheck of eventCheckList) {
                const { eventId } = eventCheck;

                userEventInfo.setEventInfo(eventId, updateDate);
            }

            if (isInsert) {
                this.getUserEventDao().insertOne(userEventInfo);
            } else {
                const { uid } = userEventInfo;
                delete userEventInfo.uid;

                const where = { uid };
                const set = userEventInfo;

                this.getUserEventDao().updateOne(where, set);
            }
        }
    }
}

module.exports = EventService;
module.exports.Schema = Schema;
