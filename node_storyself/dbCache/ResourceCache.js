const dbMongo = require('../dbMongo');
const ResourceDao = require('../daoMongo/ResourceDao');
const Cache = require('./Cache');

const tableId = 'resource';

class ResourceCacheModel {
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

class ResourceCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = ResourceCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ResourceDao(dbMongo);
    }

    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ResourceCache();