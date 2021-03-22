const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const MailSender = ValidateUtil.MailSender;

const Service = require('../service/Service');
const InventoryService = require('../service/InventoryService');

const dbMongo = require('../dbMongo');

const User = require('../models/mongo/User');
const UserEventDao = require('../daoMongo/UserEventDao');
const MailService = require('./MailService');


const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    USER_EVENT_DAO: { key: 'userEventDao', required: true, type: ValidType.OBJECT },
    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}


class EventService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {*} updateDate 
     */
    constructor(userInfo, updateDate) {
        super();

        // userDao는 context의 첫부분에서 항상 만든다.
        // 그래서 인자로 userDao를 넣는다

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.USER_EVENT_DAO.key] = new UserEventDao(dbMongo);
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    newUserEvent() {
        // 신규 유저 지급 아이템 리스트 생성
        const itemList = [];
        const pictureSlot = InventoryService.makeInventoryObject('pictureSlot', 1);
        itemList.push(pictureSlot);
        
        const honey = InventoryService.makeInventoryObject('honey', 25);
        itemList.push(honey);

        const goldi = InventoryService.makeInventoryObject('PussInBoots', 1);
        itemList.push(goldi);

        // 신규 이벤트 처리
        return itemList;
    }

    checkEvent() {
        // 이벤트 리스트에서 이벤트들을 확인
        const eventId = "123";
        const testEvent = {
            eventId,
            itemList: [
                InventoryService.makeInventoryObject('honey', 25)
            ]
        }

        const eventItemList = [
            testEvent
        ]

        const title = '임시 타이틀';
        const message = '임시 메시지';
        
        const sender = MailSender.EVENT;
        const senderId = eventId;
        const itemList = [
            InventoryService.makeInventoryObject('honey', 3)
        ];

        const itemInfo = {
            action: InventoryService.PUT_ACTION.EVENT,
            addInfo: { eventId },    
        };

        
        const eventMailList = [
            { title, message, sender, senderId, itemList, itemInfo }
        ];

        return { eventItemList, eventMailList };
    }

    async finalize() {
        // eventDao.insertMany
    }
}

module.exports = EventService;
module.exports.Schema = Schema;
