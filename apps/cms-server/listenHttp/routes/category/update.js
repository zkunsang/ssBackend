const ReqCategoryUpdate = require('@ss/models/cmsController/ReqCategoryUpdate');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemCategory = require('@ss/models/mongo/ItemCategory');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqCategoryUpdate = new ReqCategoryUpdate(ctx.request.body);
    ReqCategoryUpdate.validModel(reqCategoryUpdate);

    const itemCategory = reqCategoryUpdate.getItemCategory();
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const itemCategoryInfo = await itemCategoryDao.findOne({ itemCategory });

    if (!itemCategoryInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exsit category' };
        await next();
        return;
    }

    const updateCategoryInfo = new ItemCategory(reqCategoryUpdate);
    delete updateCategoryInfo[ItemCategory.Schema.ITEM_CATEGORY.key];

    updateCategoryInfo.setUpdateDate(updateDate);
    await itemCategoryDao.updateOne({ itemCategory}, updateCategoryInfo)

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}