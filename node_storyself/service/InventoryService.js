const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const helper = require('../helper');
const Service = require('../service/Service');

const User = require('../models/mongo/User');
const Inventory = require('../models/mongo/Inventory');

const InventoryPutObject = require('../models/service/InventoryPutObject');
const InventoryUseObject = require('../models/service/InventoryUseObject');

const InventoryDao = require('../daoMongo/InventoryDao');

const InventoryChangeInsert = require('../models/service/InventoryChangeInsert');
const InventoryChangeUpdate = require('../models/service/InventoryChangeUpdate');
const InventoryChangeDelete = require('../models/service/InventoryChangeDelete');

const SSError = require('../error');
const ItemCache = require('@ss/dbCache/ItemCache');

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
    COUPON: [1005, 1]
};

const USE_ACTION = {
    ADMIN: [2001, 1],
    CHEAT: [2002, 1],
    EXCHANGE: { 
        STORY: [2003, 1],
        ACCESSORY: [2003, 2],
        SLOT: [2003, 3],
    }
};

const Schema = {
    INVENTORY_DAO: { key: 'inventoryDao', required: true, type: ValidType.OBJECT, validObject: InventoryDao },
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class InventoryService extends Service {
    constructor(inventoryDao, userInfo, updateDate) {
        super();
        // cache system
        this[Schema.INVENTORY_DAO.key] = inventoryDao;
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    async getUserInventoryList() {
        const uid = this.userInfo.uid;
        return await this.inventoryDao.findMany({ uid });
    }

    async checkPutItem(action, putInventoryList, adminInfo) {
        Service.Validate.checkArrayObject(putInventoryList, Inventory);
        const sortedInventoryList = InventoryService.sortInventoryList(putInventoryList);

        const uid = this.userInfo.getUID();

        const userInventoryListAll = await this.getUserInventoryList();
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll);

        const insertList = [];
        const updateList = [];
        const beforeInvenMap = {};

        const createDate = this.updateDate;


        // 변경전 해당 아이템 그룹들의 총량을 미리 계산?
        for (const putInventory of sortedInventoryList) {
            putInventory.setUID(uid);
            putInventory.setUpdateDate(createDate);
            putInventory.setCreateDate(createDate);

            Inventory.validModel(putInventory);

            const itemId = putInventory.getItemId();
            const itemData = ItemCache.get(itemId);

            InventoryService.checkItemData(itemData, itemId);

            const groupId = itemData.getGroupId();
            const userInventoryList = userInventoryMap[groupId];

            InventoryService.checkMaxQny(userInventoryList, putInventory, itemData);
            InventoryService.createBeforeInvenInfo(userInventoryList, beforeInvenMap);

            const volatileSec = itemData.getVolatileSeconds();
            if (volatileSec) {
                putInventory.setEndDate(createDate + volatileSec);
                insertList.push(putInventory);
                continue;
            }
            if (!itemData.getOverLap()) {
                insertList.push(putInventory);
                continue;
            }

            const userInventory = InventoryService.findUserInventoryItem(userInventoryList, putInventory);

            if (!userInventory) {
                insertList.push(putInventory);
                continue;
            }

            userInventory.addItem(putInventory);
            updateList.push(userInventory);
        }

        return new InventoryPutObject({ insertList, updateList, beforeInvenMap, action, adminInfo });
    }

    async checkUseItem(action, useInventoryList, adminInfo) {
        Service.Validate.checkArrayObject(useInventoryList, Inventory);
        const sortedInventoryList = InventoryService.sortInventoryList(useInventoryList);

        // uid 사용 X objectId로 처리
        // const uid = this.userInfo.getUID();

        const userInventoryListAll = await this.getUserInventoryList()
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll);

        const deleteList = [];
        const updateList = [];
        const beforeInvenMap = {}

        const updateDate = this.updateDate;
        for (const useInventory of sortedInventoryList) {
            useInventory.setUpdateDate(updateDate);
            const itemId = useInventory.getItemId();
            const itemData = ItemCache.get(itemId);

            InventoryService.checkItemData(itemData, itemId);
            InventoryService.checkItemUseable(itemData, itemId, action);

            const groupId = itemData.getGroupId();

            const userInventoryList = userInventoryMap[groupId];

            // 순서 주의
            InventoryService.createBeforeInvenInfo(userInventoryList, beforeInvenMap);
            InventoryService.calculateUse(userInventoryList, useInventory, deleteList, updateList);
        }

        return new InventoryUseObject({ deleteList, updateList, beforeInvenMap, action, adminInfo });
    }

    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    async putItem(putObject) {
        InventoryPutObject.validModel(putObject);
        await this.insertItemList(putObject.getInsertList());
        await this.updateItemList(putObject.getUpdateList());

        const uid = this[Schema.USER_INFO.key].getUID();
        const updateDate = this[Schema.UPDATE_DATE.key];

        this.logPutItem(uid, updateDate, putObject);
    }

    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    logPutItem(uid, logDate, putObject) {
        const changeList = this.getPutInventoryChangeList(putObject);
        const changeLogList = this.createChangeLogList(uid, logDate, changeList);
        helper.fluent.sendInvenLog(changeLogList);
    }

    /**
     * 
     * @param {InventoryUseObject} useObject 
     */
    logUseItem(uid, logDate, useObject) {
        const changeList = this.getUseInventoryChangeList(useObject);
        const changeLogList = this.createChangeLogList(uid, logDate, changeList);
        helper.fluent.sendInvenLog(changeLogList);
    }

    createChangeLogList(uid, logDate, changeList) {
        return changeList.map((change) => change.getInvenLog(uid, logDate));
    }

    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    getPutInventoryChangeList(putObject) {
        const beforeInvenMap = putObject.getBeforeInvenMap();
        const updateList = putObject.getUpdateList();
        const insertList = putObject.getInsertList()
        const action = putObject.getAction();
        const adminInfo = putObject.getAdminInfo();

        // 신규 추가된 아이템
        const afterInvenMap = {};

        // item별로 처리
        this.makeAfterMap(afterInvenMap, insertList);
        this.makeAfterMap(afterInvenMap, updateList);
        this.makeAfterMapWithMap(afterInvenMap, beforeInvenMap);

        const beforeList = Object.values(beforeInvenMap);
        const afterList = Object.values(afterInvenMap);

        const changeList = []

        // 이전 리스트
        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();
            const afterInven = afterInvenMap[itemId];

            if (afterInven.getItemQny() == beforeInven.getItemQny()) {
                continue;
            }

            const changeMap = new InventoryChangeUpdate({ beforeInven, afterInven, action, adminInfo });
            changeList.push(changeMap);
        }

        for (const insertInven of insertList) {
            const changeMap = new InventoryChangeInsert({ insertInven, action, adminInfo });
            changeList.push(changeMap);
        }

        return changeList;
    }

    /**
     * 
     * @param {InventoryUseObject} useObject 
     */
    getUseInventoryChangeList(useObject) {
        const beforeInvenMap = useObject.getBeforeInvenMap();
        const updateList = useObject.getUpdateList();
        const deleteList = useObject.getDeleteList()
        const action = useObject.getAction();
        const adminInfo = useObject.getAdminInfo();

        // 신규 추가된 아이템
        const afterInvenMap = {};

        // item별로 처리
        this.makeAfterMap(afterInvenMap, updateList);
        this.makeAfterMapWithMap(afterInvenMap, beforeInvenMap);

        const beforeList = Object.values(beforeInvenMap);
        const changeList = []

        // 이전 리스트
        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();
            const afterInven = afterInvenMap[itemId];

            if (afterInven.getItemQny() == beforeInven.getItemQny()) {
                continue;
            }

            const changeMap = new InventoryChangeUpdate( 
                adminInfo ? 
                { beforeInven, afterInven, action, adminInfo } : 
                { beforeInven, afterInven, action });
            changeList.push(changeMap);
        }

        for (const deleteInven of deleteList) {
            const changeMap = new InventoryChangeDelete(
                adminInfo ? 
                { deleteInven, action, adminInfo } :
                { deleteInven, action });
            changeList.push(changeMap);
        }

        return changeList;
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



    async useItem(useObject) {
        InventoryUseObject.validModel(useObject);
        await this.deleteItemList(useObject.getDeleteList());
        await this.updateItemList(useObject.getUpdateList());

        const uid = this[Schema.USER_INFO.key].getUID();
        const updateDate = this[Schema.UPDATE_DATE.key];

        this.logUseItem(uid, updateDate, useObject);
    }

    async deleteItemList(deleteInventoryList) {
        for (const deleteInventory of deleteInventoryList) {
            const _id = deleteInventory.getObjectId();
            delete deleteInventory[Inventory.Schema.OBJECT_ID.key];

            await this.inventoryDao.deleteOne({ _id }, deleteInventory);
        }
    }

    async insertItemList(insertList) {
        await this.inventoryDao.insertMany(insertList);
    }

    async updateItemList(updateInventoryList) {
        for (const updateInventory of updateInventoryList) {
            const _id = updateInventory.getObjectId();
            const copyInventory = Object.assign({}, updateInventory);

            delete copyInventory[Inventory.Schema.OBJECT_ID.key];
            delete copyInventory[Inventory.Schema.UID.key];
            delete copyInventory[Inventory.Schema.ITEM_ID.key];

            await this.inventoryDao.updateOne({ _id }, copyInventory)
        }
    }

    async processExchange(useAction, useInventoryList, putAction, putInventoryList, adminInfo) {
        const putObject = await this.checkPutItem(putAction, putInventoryList, adminInfo);
        const useObject = await this.checkUseItem(useAction, useInventoryList, adminInfo);

        await this.useItem(useObject);
        await this.putItem(putObject);
    }

    async processPut(action, putInventoryList, adminInfo) {
        const putObject = await this.checkPutItem(action, putInventoryList, adminInfo);
        await this.putItem(putObject);
    }

    async processUse(action, useInventoryList, adminInfo) {
        const useObject = await this.checkUseItem(action, useInventoryList, adminInfo);
        await this.useItem(useObject);
    }

    static findUserInventoryItem(userInventoryList, invetory) {
        if (!userInventoryList) {
            return null;
        }

        for (const userInventory of userInventoryList) {
            if (userInventory.getItemId() === invetory.getItemId()) {
                return userInventory;
            }
        }

        return null;
    }

    static checkMaxQny(userInventoryList, putInventory, itemData) {
        if (!userInventoryList) return;
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0)
        const addQny = putInventory.getItemQny();
        if (itemData.getMaxQny() === 0) return;
        if (itemData.getMaxQny() < userQny + addQny) {
            throw new SSError.Service(
                SSError.Service.Code.putItemOverMaxQny,
                `${itemData.getItemId()} - ${itemData.getMaxQny()} < ${userQny} + ${addQny}`);
        }
    }

    static checkUserQny(userInventoryList, useInventory, itemData) {
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0);
        const useQny = useInventory.getItemQny();

        if (userQny < useQny) {
            throw new SSError.Service(
                SSError.Service.Code.useItemNotEnoughItem,
                `${itemData.getItemId()} - ${userQny} < ${useQny}`);
        }
    }

    static arrangeInventory(inventoryList) {
        const arrangedMap = {};
        for (const inventory of inventoryList) {
            const itemId = inventory.getItemId();
            const itemData = ItemCache.get(itemId);
            const groupId = itemData.getGroupId();

            let itemList = arrangedMap[groupId];
            if (!itemList) {
                itemList = [];
                arrangedMap[groupId] = itemList;
            }

            itemList.push(inventory);
        }

        return arrangedMap;
    }

    static checkItemData(itemData, itemId) {
        if (!itemData) {
            throw new SSError.Service(SSError.Service.Code.putItemNoExistItem, `${itemId} - not exist`);
        }
    }

    static checkItemUseable(itemData, itemId, action) {
        if(action[0] == USE_ACTION.ADMIN[0]) return;

        if (!itemData.getUseable()) {
            throw new SSError.Service(SSError.Service.Code.useItemNoUseableItem, `${itemId} - not useable`);
        }
    }

    static checkUsePossible(itemId, totalQny, useQny) {
        if (useQny > totalQny) {
            throw new SSError.Service(
                SSError.Service.Code.useItemNotEnoughItem,
                `${itemId} - ${useQny} > ${totalQny} not enugh item`);
        }
    }

    static calculateUse(userInventoryList, useInventory, deleteList, updateList) {
        const userVolatileList = [];
        const userNonVolatileList = [];

        let totalQny = 0;
        for (const userInventory of userInventoryList || []) {
            const itemId = userInventory.getItemId();
            const itemData = ItemCache.get(itemId);
            InventoryService.checkItemData(itemData, itemId);

            itemData.getVolatileSeconds() ?
                userVolatileList.push(userInventory) :
                userNonVolatileList.push(userInventory);

            totalQny += userInventory.getItemQny();
        }

        InventoryService.checkUsePossible(useInventory.getItemId(), totalQny, useInventory.getItemQny());
        InventoryService.calculateUseVolatile(userVolatileList, useInventory, deleteList, updateList);
        InventoryService.calculateUseBasic(userNonVolatileList, useInventory, deleteList, updateList);
    }

    static calculateUseVolatile(userInventoryList, useInventory, deleteList, updateList) {
        userInventoryList.sort((a, b) => a.getEndDate() - b.getEndDate())
        InventoryService.calculateUseBasic(userInventoryList, useInventory, deleteList, updateList);
    }

    static calculateUseBasic(userInventoryList, useInventory, deleteList, updateList) {
        const deleteCnt = useInventory.getItemQny();

        for (const userInventory of userInventoryList) {
            let invenItemQny = userInventory.getItemQny();

            if (invenItemQny > deleteCnt) {
                userInventory.minusItem(useInventory);
                useInventory.setItemQny(0);
                updateList.push(userInventory);
                break;
            }
            else if (invenItemQny === deleteCnt) {
                userInventory.minusItem(useInventory);
                useInventory.setItemQny(0);
                deleteList.push(userInventory)
                break;
            }
            else {
                userInventory.minusItem(userInventory);
                useInventory.setItemQny(deleteCnt - invenItemQny);
                deleteList.push(userInventory);
                break;
            }
        }
    }

    static makeInventoryObject(itemId, itemQny) {
        return new Inventory({ itemId, itemQny });
    }

    static makeInventoryList(itemList) {
        return itemList.map((item) => new Inventory({ itemId: item.itemId, itemQny: item.itemQny }))
    }


    static sortInventoryList(inventoryList) {
        let returnObject = {};
        for (const inventory of inventoryList) {
            const itemId = inventory.getItemId();
            const itemQny = inventory.getItemQny();

            let tempInventory = returnObject[itemId]
            if (tempInventory) {
                tempInventory.setItemQny(tempInventory.getItemQny() + itemQny);
            }
            else {
                returnObject[itemId] = new Inventory(inventory);
            }
        }
        return Object.values(returnObject);
    }

    // using object id create map info once
    static createBeforeInvenInfo(userInventoryList, beforeInvenMap) {
        if (!userInventoryList) { return; }

        for (const inventory of userInventoryList) {
            const itemId = inventory.getItemId();

            if (!beforeInvenMap[itemId]) {
                beforeInvenMap[itemId] = new Inventory(inventory);
            }
            else {
                beforeInvenMap[itemId].addItem(inventory);
            }
        }
    }

    static removeObjectIdList(inventoryList) {
        for(const inventory of inventoryList) {
            delete inventory[Inventory.Schema.OBJECT_ID.key];
            delete inventory[Inventory.Schema.CREATE_DATE.key];
            delete inventory[Inventory.Schema.UPDATE_DATE.key];
            delete inventory[Inventory.Schema.UID.key];
        }

        return inventoryList;
    }

    static removeObjectId(inventory) {
        delete inventory[Inventory.Schema.OBJECT_ID.key];
    }
}

module.exports = InventoryService;
module.exports.Schema = Schema;
module.exports.PUT_ACTION = PUT_ACTION;
module.exports.USE_ACTION = USE_ACTION;
