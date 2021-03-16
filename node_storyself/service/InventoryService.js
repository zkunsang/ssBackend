const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const helper = require('../helper');
const Service = require('../service/Service');

const User = require('../models/mongo/User');
const Inventory = require('../models/mongo/Inventory');
const InventoryDao = require('../daoMongo/InventoryDao');

const InventoryPut = require('../models/service/InventoryPut');
const InventoryUse = require('../models/service/InventoryUse');

const InventoryLog = require('../models/apilog/InventoryLog');

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
        BETA_EVENT: [1006, 1]
    },
    STORY_QUEST: [1007, 1],
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

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    INVENTORY_LOG_DAO: { key: 'inventoryLogDao', required: true, type: ValidType.OBJECT },

    UID: { key: 'uid', required: false, type: ValidType.STRING },
    INVENTORY: { key: 'inventory', required: false, type: ValidType.OBJECT },

    USE_LIST: { key: 'useList', required: false, type: ValidType.ARRAY },
    PUT_LIST: { key: 'putList', required: false, type: ValidType.ARRAY },
}

class InventoryService extends Service {
    constructor(userInfo, updateDate, inventoryLogDao) {
        super();

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;
        this[Schema.INVENTORY_LOG_DAO.key] = inventoryLogDao;
        
        const { inventory, uid } = userInfo;
        
        this[Schema.INVENTORY.key] = InventoryDao.mappingList(inventory || []);
        this[Schema.UID.key] = uid;

        this[Schema.PUT_LIST.key] = [];
        this[Schema.USE_LIST.key] = [];
    }

    getUserInventory() {
        return this[Schema.INVENTORY.key];
    }

    getUserInventoryMap() {
        const inventory = this.getUserInventory();
        return ArrayUtil.keyBy(inventory, 'itemId');
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

    /**
     * 
     * @param {*} action 
     * @param {*} addInfo 
     * @param {Array.<Inventory>} putInvenList 
     */
    putItem(action, addInfo, putInvenList) {
        const putMap = {};

        for(const putInven of putInvenList) {
            const { itemId, itemQny } = putInven;

            if(putMap[itemId]) {
                putMap[itemId].addQny(itemQny);
            } else {
                putMap[itemId] = new InventoryPut({ ...putInven, action, addInfo })
            }
        }

        this.putListPush(Object.values(putMap));
    }

    useItem(action, addInfo, useInvenList) {
        const useMap = {};

        for(const useInven of useInvenList) {
            const { itemId, itemQny } = useInven;

            if(useMap[itemId]) {
                useMap[itemId].addQny(itemQny);
            } else {
                useMap[itemId] = new InventoryUse({ ...useInven, action, addInfo });
            }
        }

        this.useListPush(Object.values(useMap));
    }

    async finalize() {
        const userInventoryMap = this.getUserInventoryMap();
        
        // TODO: Log처리
        const putLogList = this.processPut(userInventoryMap);
        for(const putLog of putLogList) {
            console.log(putLog);
        }
        
        const useLogList = this.processUse(userInventoryMap);
        for(const useLog of useLogList) {
            console.log(useLog);
        }

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

            const log = this.putInventory(userInvenMap[itemId], putInven);
            
            logList.push(log);
        }

        
        return logList;
    }

    processUse(userInvenMap) {
        const useList = this.getUseList();
        const logList = [];

        for(const useInven of useList) {
            const itemId = useInven.getItemId();
            const itemQny = useInven.getItemQny();

            if(!userInvenMap[itemId]) {
                throwNotEnoughItem(itemId, 0, itemQny);
            }
            const userItemQny = userInvenMap[itemId].getItemQny();
            if (userItemQny < itemQny) {
                throwNotEnoughItem(itemId, userItemQny, itemQny);
            }

            const log = this.useInventory(userInvenMap[itemId], useInven);
            
            logList.push(log);
        }

        return logList;
    }

    throwNotEnoughItem(itemId, userQny, useQny) {
        throw new SSError.Service(
            SSError.Service.Code.useItemNotEnoughItem,
            `${itemId} - ${userQny} < ${useQny}`);
    }

    /**
     * 
     * @param {Inventory} origin 
     * @param {InventoryPut} update 
     */
    putInventory(origin, update) {
        const uid = this.getUID();
        const logDate = this.getUpdateDate();
        const itemId = origin.getItemId();
        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.itemCategory;

        const beforeQny = origin.getItemQny();
        const diffQny = update.getItemQny();
        const afterQny = beforeQny + diffQny;

        const action = update.getAction();
        const addInfo = update.getAddInfo();

        origin.addItem(update);
        
        return new InventoryLog({ uid, itemId, itemCategory, beforeQny, diffQny, afterQny, logDate, action, addInfo });
    }

    
    /**
     * 
     * @param {Inventory} origin 
     * @param {InventoryUse} update 
     */
    useInventory(origin, update) {
        const uid = this.getUID();
        const logDate = this.getUpdateDate();
        const itemId = origin.getItemId();
        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.itemCategory;

        const beforeQny = origin.getItemQny();
        const diffQny = update.getItemQny();
        const afterQny = beforeQny - diffQny;

        const action = update.getAction();
        const addInfo = update.getAddInfo();

        origin.minusItem(update);

        return new InventoryLog({ uid, itemId, itemCategory, beforeQny, diffQny, afterQny, logDate, action, addInfo });
    }

    /**
     * 
     * @param {InventoryUse} useItem 
     */
    useListPush(useItem) {
        if(Array.isArray(useItem)) {
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
        if(Array.isArray(putItem)) {
            this[Schema.PUT_LIST.key].push(...putItem);
            return;
        } 
        this[Schema.PUT_LIST.key].push(putItem);
    }

    /**
     * 
     * @param {InventoryUse
     *} useObject 
     */
    logUseItem(useObject) {
        this.getUseInventoryChangeList(useObject);
        
    }

    createChangeLogList() {
        const uid = this[Schema.UID.key];
        const logDate = this[Schema.UPDATE_DATE.key];
        
        this[Schema.CHANGE_LOG_LIST.key] = changeList.map((change) => change.getInvenLog(uid, logDate));
    }

    pushChangeList(change) {
        this[Schema.CHANGE_LIST.key].push(change);
    }
    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    getPutInventoryChangeList(putObject) {
        const beforeInvenMap = putObject.getBeforeInvenMap();
        const updateList = putObject.getUpdateList();
        const insertList = putObject.getInsertList()

        // 신규 추가된 아이템
        const afterInvenMap = {};

        // item별로 처리
        this.makeAfterMap(afterInvenMap, insertList);
        this.makeAfterMap(afterInvenMap, updateList);
        this.makeAfterMapWithMap(afterInvenMap, beforeInvenMap);

        const beforeList = Object.values(beforeInvenMap);

        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();
            const afterInven = afterInvenMap[itemId];

            if (afterInven.getItemQny() == beforeInven.getItemQny()) {
                continue;
            }

            const changeMap = new InventoryChangeUpdate({ beforeInven, afterInven });
            this.pushChangeList(changeMap);
        }

        for (const insertInven of insertList) {
            const changeMap = new InventoryChangeInsert({ insertInven });
            this.pushChangeList(changeMap);
        }
    }

    makeAfterMap(afterInvenMap, invenList) {
        for (const inventory of invenList) {
            const itemId = inventory.getItemId();
            if (!afterInvenMap[itemId]) {
                afterInvenMap[itemId] = inventory;
            }
            else {
                afterInvenMap[itemId].addItem(inventory);
            }
        }
    }

    makeAfterMapWithMap(afterInvenMap, beforeInvenMap) {
        const beforeList = Object.values(beforeInvenMap);

        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();

            if (!afterInvenMap[itemId]) {
                afterInvenMap[itemId] = beforeInven;
            }
        }
    }

    processExchange(useAction,
        useInventoryList,
        putAction,
        putInventoryList,
        addInfo
    ) {
        
        this.useItem(useObject);
        this.putItem(putObject);
    }

    static makeInventoryObject(itemId, itemQny) {
        return new Inventory({ itemId, itemQny });
    }

    static makeInventoryList(itemList) {
        return itemList.map((item) => new Inventory({ itemId: item.itemId, itemQny: item.itemQny }))
    }
}

module.exports = InventoryService;
module.exports.Schema = Schema;
module.exports.PUT_ACTION = PUT_ACTION;
module.exports.USE_ACTION = USE_ACTION;
