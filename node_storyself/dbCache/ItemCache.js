const dbMongo = require('../dbMongo');
const ItemDao = require('../daoMongo/ItemDao');

const Item = require('../models/mongo/Item');
const Cache =require('./Cache');

const ArrayUtil = require('../util/ArrayUtil');
const _ = require('lodash');

const tableId = 'item';

class ItemCacheModel {
    constructor() {
        this.itemList = null;
        this.itemMapByItemId = null;
        this.itemListByGroupId = null;
    }

    async loadData(itemDao) {
        this.itemList = await itemDao.findAll();

        this.parseItemByItemId();
        this.parseItemByGroupId();
    }

    parseItemByItemId() {
        this.itemMapByItemId = _.keyBy(this.itemList, Item.Schema.ITEM_ID.key);
    }

    parseItemByGroupId() {
        this.itemListByGroupId = ArrayUtil.getMapArrayByKey(this.itemList, Item.Schema.GROUP_ID);
    }

    get(itemId) {
        return this.itemMapByItemId[itemId];
    }

    getListByGroupId(groupId) {
        return this.itemListByGroupId[groupId]
    }

    getList() {
        return this.itemList;
    }
}

class ItemCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = ItemCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ItemDao(dbMongo);
    }

    get(itemId) {
        return this.currentCacheModel.get(itemId);
    }

    getListByGroupId(groupId) {
        return this.currentCacheModel.getListByGroupId(groupId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }

    getMap() {
        return this.currentCacheModel.getMap();
    }
}

module.exports = new ItemCache();