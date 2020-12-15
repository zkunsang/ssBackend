const ReqProductGroupList = require('@ss/models/cmsController/ReqProductGroupList');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');

const DateUtil = require('@ss/util/DateUtil');

function unixTimestampToDateString(productGroupList) {
    for(const group of productGroupList) {
        DateUtil.utsToDsObj(group, 'startDate');
        DateUtil.utsToDsObj(group, 'endDate');
    }
    
}

module.exports = async (ctx, next) => {
    const reqProductGroupList = new ReqProductGroupList(ctx.request.body);
    ReqProductGroupList.validModel(reqProductGroupList);

    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const productGroupList = await productGroupDao.findAll();

    unixTimestampToDateString(productGroupList);

    ctx.status = 200;
    ctx.body.data = { productGroupList };
    await next();
    
}