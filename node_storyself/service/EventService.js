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
  eventDefaultItem(userEventInfo) {
    const eventId = "2";

    // if (userEventInfo && userEventInfo.hasEventInfo(eventId)) return [[]];

    const eventInfo = { eventId };

    const action = InventoryService.PUT_ACTION.EVENT.DEFAULT_ITEM;
    const addInfo = { eventInfo };
    const itemList = [
      { itemId: 'bookubooku0', itemQny: 1 },
      { itemId: 'bookubooku1', itemQny: 1 },
      { itemId: 'star1', itemQny: 1 },
      { itemId: 'heartglasses0', itemQny: 1 },
      { itemId: 'beard1', itemQny: 1 },

      { itemId: 'stk_Peterpan_tree_0', itemQny: 5 },
      { itemId: 'stk_AliceInWonderland_twitter_0', itemQny: 5 },
      { itemId: 'stk_AliceInWonderland_android_0', itemQny: 5 },
      { itemId: 'stk_LittlePrince_flower_0', itemQny: 5 },
      { itemId: 'stk_LittlePrince_fox_0', itemQny: 5 },
    ]

    this.pushEventCheckList(eventInfo);

    const eventItemList = [
      new EventReward({ eventId }, { action, addInfo, itemList })
    ];

    return [eventItemList];
  }

  eventFirstVisit(userEventInfo) {
    // TODO: 임시 이벤트
    // 이벤트 리스트에서 이벤트들을 확인
    const eventId = "1";

    this.setUserEventInfo(userEventInfo);

    if (userEventInfo && userEventInfo.hasEventInfo(eventId)) return [[]];

    const eventInfo = { eventId };

    const action = InventoryService.PUT_ACTION.EVENT.TEMP_EVENT;
    const addInfo = { eventInfo };
    const itemList = [{ itemId: 'honey', itemQny: 25 }];

    const eventItemList = [
      new EventReward({ eventId }, { action, addInfo, itemList })
    ];

    const title = '첫 방문 기념 25꿀 증정';
    const title_en = 'Get 25 honey jar for your first visit.'
    const message = '첫 방문 기념 25꿀을 드려요. 다양한 스토리 구매, 악세사리 구매에 활용해보세요.';
    const message_en = `Your free 25 Honey jars for the first visit. You can use them to purchase stories or in app accesorries.`;

    const sender = MailSender.EVENT;
    const senderId = eventId;
    // const emailItemList = [{ itemId: 'honey', itemQny: 3 }];
    const emailItemList = [];

    const itemInfo = {
      action: InventoryService.PUT_ACTION.EVENT.TEMP_EVENT,
      addInfo: { eventId },
    };

    const eventMailList = [
      { title, title_en, message, message_en, sender, senderId, itemList: emailItemList, itemInfo }
    ];

    this.pushEventCheckList(eventInfo);

    return [eventMailList];
  }

  async checkEvent() {
    const uid = this.getUID();

    const userEventInfo = await this.getUserEventDao().findOne({ uid });
    const [ev1MailList] = this.eventFirstVisit(userEventInfo);
    const [ev2ItemList] = this.eventDefaultItem(userEventInfo);

    return { eventItemList: [...ev2ItemList], eventMailList: [...ev1MailList] };
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
