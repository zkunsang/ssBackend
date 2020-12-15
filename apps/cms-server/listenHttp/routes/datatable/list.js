const DataTableDao = require('@ss/daoMongo/DataTableDao');
const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'updateDate');
    }
}
module.exports = async (ctx, next) => {
    const dataTableDao = new DataTableDao(ctx.$dbMongo);
    const dataTableList = await dataTableDao.findAll();

    utsToDsObj(dataTableList);
    
    ctx.status = 200;
    ctx.body.data = { dataTableList };
    await next();
}