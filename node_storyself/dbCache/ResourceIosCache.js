const dbMongo = require('../dbMongo');
const ResourceIosDao = require('../daoMongo/ResourceIosDao');
const Cache = require('./Cache');

const tableId = 'resource_ios';

class ResourceIosCacheModel {
    constructor() {
        this.resourceList = null;
    }

    async loadData(resourceDao) {
        this.resourceList = await resourceDao.findAll();
    }

    getList() {
        return this.resourceList;
    }
}

class ResourceIosCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = ResourceIosCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ResourceIosDao(dbMongo);
    }

    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ResourceIosCache();