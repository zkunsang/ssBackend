const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Service = require('../service/Service');

const User = require('../models/mongo/User');
const Inventory = require('../models/mongo/Inventory');

const InventoryPut = require('../models/service/InventoryPut');
const InventoryUse = require('../models/service/InventoryUse');

const InventoryLog = require('../models/apilog/InventoryLog');
const InventoryLogDao = require('../daoMongo/InventoryLogDao');

const InventoryDao = require('../daoMongo/InventoryDao');

const dbMongo = require('../dbMongo');

const SSError = require('../error');
const ItemCache = require('@ss/dbCache/ItemCache');
const ArrayUtil = require('@ss/util/ArrayUtil');

const PUT_ACTION = {
    PURCHASE: {
        CASH: [1000, 1]
    },
    ADMIN: [1001, 1],

    CHEAT: [1002, 1],
    EXCHANGE: {
        STORY: [1003, 1],
        ACCESSORY: [1003, 2],
        SLOT: [1003, 3],
    },
    USER_INIT: [1004, 1],
    COUPON: [1005, 1],
    EVENT: {
        TEMP_EVENT: [1006, 0],
        BETA_EVENT: [1006, 1],
        EVENT: [1006, 2],
        STORY_EVENT: [1006, 3]
    },
    STORY_QUEST: [1007, 1],
    WRONG_INVENTORY: [9000, 1],
};

const USE_ACTION = {
    ADMIN: [2001, 1],
    CHEAT: [2002, 1],
    EXCHANGE: {
        STORY: [2003, 1],
        ACCESSORY: [2003, 2],
        SLOT: [2003, 3],
    },
    QUEST_DELETE: [2004, 1]
};

const LOG_TYPE = {
    USE: 1,
    PUT: 2
}

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },

    UID: { key: 'uid', required: false, type: ValidType.STRING },
    INVENTORY: { key: 'inventory', required: false, type: ValidType.OBJECT },
    INVENTORY_MAP: { key: 'inventoryMap', required: false, type: ValidType.OBJECT },

    USE_LIST: { key: 'useList', required: false, type: ValidType.ARRAY },
    PUT_LIST: { key: 'putList', required: false, type: ValidType.ARRAY },
}

class InventoryService extends Service {
    constructor(userInfo, updateDate) {
        super();

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;

        const { inventory, uid } = userInfo;

        this[Schema.INVENTORY.key] = inventory ? ArrayUtil.map(inventory, (item) => new Inventory(item)) : [];
        this[Schema.INVENTORY_MAP.key] = ArrayUtil.keyBy(inventory, "itemId");
        this[Schema.UID.key] = uid;

        this[Schema.PUT_LIST.key] = [];
        this[Schema.USE_LIST.key] = [];

        this.isChange = false;
    }

    getUserInventory() {
        return this[Schema.INVENTORY.key];
    }

    getUserInventoryMap() {
        return this[Schema.INVENTORY_MAP.key];
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getUseList() {
        return this[Schema.USE_LIST.key];
    }

    getPutList() {
        return this[Schema.PUT_LIST.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getUserInfo() {
        return this[Schema.USER_INFO.key];
    }

    /**
     * 
     * @param {*} action 
     * @param {*} addInfo 
     * @param {Array.<Inventory>} putInvenList 
     */
    putItem(action, addInfo, putInvenList) {
        if (putInvenList.length === 0) return;

        const putMap = {};

        for (const putInven of putInvenList) {
            const { itemId, itemQny } = putInven;

            if (putMap[itemId]) {
                putMap[itemId].addQny(itemQny);
            } else {
                putMap[itemId] = new InventoryPut({ ...putInven, action, addInfo })
            }
        }
        this.isChange = true;
        this.putListPush(Object.values(putMap));
    }

    useItem(action, addInfo, useInvenList) {
        if (useInvenList.length === 0) return;
        const useMap = {};

        for (const useInven of useInvenList) {
            const { itemId, itemQny } = useInven;

            if (useMap[itemId]) {
                useMap[itemId].addQny(itemQny);
            } else {
                useMap[itemId] = new InventoryUse({ ...useInven, action, addInfo });
            }
        }

        this.isChange = true;
        this.useListPush(Object.values(useMap));
    }

    checkAlready(putInvenList) {
        const uid = this.getUID();
        const inventory = this.getUserInventoryMap();
        for (const putItem of putInvenList) {
            const { itemId } = putItem;
            if (inventory[itemId]) {
                this.throwAlreadyHasItem(uid, itemId);
            }
        }
    }

    putEventItemList(eventRewardList) {
        if (!eventRewardList) return;
        for (const eventReward of eventRewardList) {
            const rewardInfo = eventReward.getRewardInfo();

            const { action, addInfo, itemList } = rewardInfo;
            this.putItem(action, addInfo, itemList);
        }
    }

    finalize() {
        const updateDate = this.getUpdateDate();
        const userInventoryMap = this.getUserInventoryMap(updateDate);

        if (!this.isChange) {
            return Object.values(userInventoryMap);
        }

        const putLogList = this.processPut(userInventoryMap);
        const useLogList = this.processUse(userInventoryMap);

        const inventoryLogDao = new InventoryLogDao(dbMongo, updateDate);
        inventoryLogDao.insertMany([...putLogList, ...useLogList]);

        return Object.values(userInventoryMap);
    }

    processPut(userInvenMap) {
        const putList = this.getPutList();
        const logList = [];

        // 액션에 상관없이 하나로 뭉침
        for (const putInven of putList) {
            const itemId = putInven.getItemId();

            if (!userInvenMap[itemId]) {
                userInvenMap[itemId] = new Inventory({ itemId, itemQny: 0 });
            }

            const log = this.createInvenLog(userInvenMap[itemId], putInven, LOG_TYPE.PUT);
            logList.push(log);
        }

        return logList;
    }

    processUse(userInvenMap) {
        const useList = this.getUseList();
        const logList = [];

        for (const useInven of useList) {
            const itemId = useInven.getItemId();
            const itemQny = useInven.getItemQny();

            if (!userInvenMap[itemId]) {
                this.throwNotEnoughItem(itemId, 0, itemQny);
            }

            const userItemQny = userInvenMap[itemId].getItemQny();
            if (userItemQny < itemQny) {
                this.throwNotEnoughItem(itemId, userItemQny, itemQny);
            }

            const log = this.createInvenLog(userInvenMap[itemId], useInven, LOG_TYPE.USE);

            logList.push(log);
        }

        return logList;
    }

    // 처음 인벤토리 구조를 rdb구조로 잘못 구성
    // rdb구조의 inventory -> mongodb구조의 inventory로 처리해주는 로직
    async checkWrongInventory() {
        const uid = this.getUID();
        const userInventory = this.getUserInventory();
        if (userInventory.length !== 0) return null;

        const inventoryDao = new InventoryDao(dbMongo);
        const inventoryList = await inventoryDao.findMany({ uid });

        this.putItem(
            PUT_ACTION.WRONG_INVENTORY, {},
            inventoryList.map(item => new Inventory(item)));
    }


    createInvenLog(origin, update, logType) {
        const isUse = logType === LOG_TYPE.USE;

        const uid = this.getUID();
        const logDate = this.getUpdateDate();
        const itemId = origin.getItemId();
        const itemData = ItemCache.get(itemId);

        const itemCategory = itemData.itemCategory;

        const beforeQny = origin.getItemQny();
        const useQny = update.getItemQny();
        const diffQny = isUse ? useQny * -1 : useQny;
        const afterQny = beforeQny + diffQny;

        const action = update.getAction();
        const addInfo = update.getAddInfo();

        if (isUse) {
            origin.minusItem(update);
        } else {
            origin.addItem(update);
        }

        return new InventoryLog({ uid, itemId, itemCategory, beforeQny, diffQny, afterQny, logDate, action, addInfo });
    }

    /**
     * 
     * @param {InventoryUse} useItem 
     */
    useListPush(useItem) {
        if (Array.isArray(useItem)) {
            this[Schema.USE_LIST.key].push(...useItem);
            return;
        }
        this[Schema.USE_LIST.key].push(useItem);
    }

    /**
     * 
     * @param {InventoryPut} putItem 
     */
    putListPush(putItem) {
        if (Array.isArray(putItem)) {
            this[Schema.PUT_LIST.key].push(...putItem);
            return;
        }
        this[Schema.PUT_LIST.key].push(putItem);
    }

    pushChangeList(change) {
        this[Schema.CHANGE_LIST.key].push(change);
    }

    makeInventoryObject(itemId, itemQny) {
        return new Inventory({ itemId, itemQny });
    }

    makeInventoryList(itemList) {
        return ArrayUtil.map(itemList, (item) => new Inventory(item));
    }

    makeInventoryStoryList(storyIdList) {
        return ArrayUtil.map(storyIdList, (storyId) => new Inventory({ itemId: storyId, itemQny: 1 }));
    }

    throwNotEnoughItem(itemId, userQny, useQny) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.useItemNotEnoughItem,
            `[${uid}]: ${itemId} - ${userQny} < ${useQny}`);
    }

    throwAlreadyHasItem(itemId) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.alreadyHaveItem, `[${uid}]: itemId(${itemId})`
        )
    }
}

module.exports = InventoryService;
module.exports.Schema = Schema;
module.exports.PUT_ACTION = PUT_ACTION;
module.exports.USE_ACTION = USE_ACTION;
