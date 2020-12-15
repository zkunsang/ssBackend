const DNNResourceDao = require('@ss/daoMongo/DNNResourceDao');

const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const dnnResourceDao = new DNNResourceDao(ctx.$dbMongo);
    const dnnResourceList = await dnnResourceDao.findAll();

    utsToDsObj(dnnResourceList);
    
    ctx.status = 200;
    ctx.body.data = dnnResourceList || [];
    await next();
}