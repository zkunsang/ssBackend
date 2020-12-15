const dbMongo = require('../dbMongo');
const DataTableDao = require('../daoMongo/DataTableDao');

const DataTable = require('../models/mongo/DataTable');

const _ = require('lodash');

class DataTableCacheModel {
    constructor() {
        this.dataTableList = null;
        this.dataTableMap = null;
    }

    async loadData(dataTableDao) {
        this.dataTableList = await dataTableDao.findAll();

        for(const dataTable of this.dataTableList) {
            delete dataTable[DataTable.Schema.UPDATE_DATE.key];
        }
        
        this.parseDataTable();
    }

    parseDataTable() {
        this.dataTableMap = _.keyBy(this.dataTableList, DataTable.Schema.TABLE_ID.key);
    }

    get(tableId) {
        return this.dataTableMap[tableId];
    }

    getList() {
        return this.dataTableList;
    }
}

class DataTableCache {
    constructor() {    
        this.dataTableDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.dataTableDao = new DataTableDao(dbMongo);
    }

    async loadData() {
        // TODO: 동일 버젼 올라왔을때 처리
        // if(version == this.version) {
        //     console.error('same version load')
        //     return;
        // }

        //일단 loadData가 들어오면 무조건 로드
        this.version++;
        this.cacheManager[this.version] = new DataTableCacheModel()
        await this.cacheManager[this.version].loadData(this.dataTableDao);
        this.currentCacheModel = this.cacheManager[this.version];
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

    getCacheModel() {
        return this.currentCacheModel;
    }
}

module.exports = new DataTableCache();