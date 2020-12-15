const dbMongo = require('../dbMongo');

const ProductRewardDao = require('../daoMongo/ProductRewardDao');
const ProductReward = require('../models/mongo/ProductReward');

const Cache = require('./Cache');

const ArrayUtil = require('@ss/util/ArrayUtil');

const tableId = 'productReward';
class ProductRewardCacheModel {
    constructor() {
        this.productRewardList = null;
        this.productRewardMap = null;
    }

    async loadData(productRewardDao) {
        this.productRewardList = await productRewardDao.findAll();

        this.parseProductReward();
    }

    parseProductReward() {
        this.productRewardMap = ArrayUtil.getMapArrayByKey(this.productRewardList, ProductReward.Schema.PRODUCT_ID.key);
    }

    get(productId) {
        return this.productRewardMap[productId];
    }

    getList() {
        return this.productRewardList;
    }
}

class ProductRewardCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = ProductRewardCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ProductRewardDao(dbMongo);
    }

    get(productId) {
        return this.currentCacheModel.get(productId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ProductRewardCache();