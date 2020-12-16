const CommonResourceDao = require('@ss/daoMongo/CommonResourceDao');

const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const commonResourceDao = new CommonResourceDao(ctx.$dbMongo);
    const commonResourceList = await commonResourceDao.findAll();

    utsToDsObj(commonResourceList);
    
    ctx.status = 200;
    ctx.body.data = commonResourceList || [];
    await next();
}