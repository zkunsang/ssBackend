const dbMongo = require('../dbMongo');
const ItemMaterialDao = require('../daoMongo/ItemMaterialDao');

const ItemMaterial = require('../models/mongo/ItemMaterial');
const Cache = require('./Cache');
const ArrayUtil = require('../util/ArrayUtil');

const tableId = 'itemExchange';
class ItemMaterialCacheModel {
    constructor() {
        this.itemMaterialList = null;
        this.itemMaterialListByItemId = null;
    }

    async loadData(itemMaterialDao) {
        this.itemMaterialList = await itemMaterialDao.findAll();

        this.parseItemMaterialListByItemId();
    }

    parseItemMaterialListByItemId() {
        this.itemMaterialListByItemId = ArrayUtil.getMapArrayByKey(
            this.itemMaterialList,
            ItemMaterial.Schema.ITEM_ID.key);
    }

    getListByItemId(itemId) {
        return this.itemMaterialListByItemId[itemId];
    }

    getList() {
        return this.itemMaterialList;
    }
}

class ItemMaterialCache extends Cache {
    constructor() {
        super();
        this.cacheModel = ItemMaterialCacheModel;
        this.tableId = tableId;
    }

    async ready() {
        this.dao = new ItemMaterialDao(dbMongo);
    }

    getListByItemId(itemId) {
        return this.currentCacheModel.getListByItemId(itemId);
    }

    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ItemMaterialCache();