const dbMongo = require('../dbMongo');
const ProductDao = require('../daoMongo/ProductDao');

const Product = require('../models/mongo/Product');
const Cache = require('./Cache');
const _ = require('lodash');

const tableId = 'product'

class ProductCacheModel {
    constructor() {
        this.productList = null;
        this.productMap = null;
    }

    async loadData(productDao) {
        this.productList = await productDao.findAll();

        this.parseProductMap();
    }

    parseProductMap() {
        this.productMap = _.keyBy(this.productList, Product.Schema.PRODUCT_ID.key);
    }

    get(productId) {
        return this.productMap[productId];
    }

    getList() {
        return this.productList;
    }
}

class ProductCache extends Cache{
    constructor() {    
        super();
        this.cacheModel = ProductCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ProductDao(dbMongo);
    }

    get(productId) {
        return this.currentCacheModel.get(productId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ProductCache();