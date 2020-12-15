const dbMongo = require('../dbMongo');
const ServiceVariableDao = require('../daoMongo/ServiceVariableDao');

const ArrayUtil = require('../util/ArrayUtil');

const Cache = require('./Cache');
const tableId = 'serviceVariable';

// 서비스 관련 변수
class ServiceVariableModel {
    constructor() {
        this.serviceVariableList = null;
        this.serviceVariableMap = null;
    }

    async loadData(serviceDao) {
        this.serviceVariableList = await serviceDao.findAll();
        this.serviceVariableMap = ArrayUtil.keyBy(this.serviceVariableList, 'key');
    }

    get(key) {
        return this.serviceVariableMap[key];
    }
}

class ServiceVariableCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = ServiceVariableModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new ServiceVariableDao(dbMongo);
    }

    get(key) {
        return this.currentCacheModel.get(key);
    }
}

module.exports = new ServiceVariableCache();