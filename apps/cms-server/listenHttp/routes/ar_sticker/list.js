const ARStickerResourceDao = require('@ss/daoMongo/ARStickerResourceDao');

const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const arStickerResourceDao = new ARStickerResourceDao(ctx.$dbMongo);
    const arStickerResourceList = await arStickerResourceDao.findAll();

    utsToDsObj(arStickerResourceList);
    
    ctx.status = 200;
    ctx.body.data = arStickerResourceList || [];
    await next();
}