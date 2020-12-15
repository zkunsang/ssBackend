const ReqCategoryList = require('@ss/models/cmsController/ReqCategoryList');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');

module.exports = async (ctx, next) => {
    const reqCategoryList = new ReqCategoryList(ctx.request.body);
    ReqCategoryList.validModel(reqCategoryList);

    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const categoryList = await itemCategoryDao.findAll();

    ctx.status = 200;
    ctx.body.data = { categoryList };
    await next();
    
}