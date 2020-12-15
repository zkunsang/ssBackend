const DataTableDao = require('@ss/daoMongo/DataTableDao');

class DataTableVersionHelper {
    constructor() {}

    static async getTableVersion(ctx, tableId) {
        const tableInfo = await this.getTableVersionInfo(ctx, tableId);
        let version = 0;
        if(tableInfo) {
            version = tableInfo.version;
        }   

        return version;
    }

    static async updateVersion(ctx, tableId) {
        const tableInfo = await this.getTableVersionInfo(ctx, tableId);
        let version = 0;
        if(tableInfo) {
            version = tableInfo.version
        }   

        return version;
    }

    static async getTableVersionInfo(ctx, tableId) {
        const dataTableDao = new DataTableDao(ctx.$dbMongo);
        return await dataTableDao.findOne({tableId});
    }
}

module.exports = DataTableVersionHelper;