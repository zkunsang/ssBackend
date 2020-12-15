const ReqCategoryCreate = require('@ss/models/cmsController/ReqCategoryCreate');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemCategory = require('@ss/models/mongo/ItemCategory');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqCategoryCreate = new ReqCategoryCreate(ctx.request.body);
    ReqCategoryCreate.validModel(reqCategoryCreate);

    const itemCategory = reqCategoryCreate.getItemCategory();
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const itemCategoryInfo = await itemCategoryDao.findOne({ itemCategory });

    if (itemCategoryInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist' };
        await next();
        return;
    }

    const createCategoryInfo = new ItemCategory(reqCategoryCreate);
    createCategoryInfo.setUpdateDate(updateDate);

    await itemCategoryDao.insertOne(createCategoryInfo)

    ctx.status = 200;
    ctx.body.data = {};
    await next();

}