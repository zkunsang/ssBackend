const dbMongo = require('../dbMongo');

const ProductGroupDao = require('../daoMongo/ProductGroupDao');
const ProductGroup = require('../models/mongo/ProductGroup');
const Cache = require('./Cache');

const _ = require('lodash');

const tableId = 'productGroup';

class ProductGroupCacheModel {
    constructor() {
        this.productGroupList = null;
        this.productGroupMap = null;
    }

    async loadData(productGroupDao) {
        this.productGroupList = await productGroupDao.findAll();

        this.parseProductByItemId();
    }

    parseProductByItemId() {
        this.productGroupMap = _.keyBy(this.productGroupList, ProductGroup.Schema.GROUP_ID.key);
    }

    get(groupId) {
        return this.productGroupMap[groupId];
    }

    getList() {
        return this.productGroupList;
    }
}

class ProductGroupCache extends Cache{
    constructor() {    
        super();
        this.cacheModel = ProductGroupCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ProductGroupDao(dbMongo);
    }

    get(groupId) {
        return this.currentCacheModel.get(groupId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ProductGroupCache();