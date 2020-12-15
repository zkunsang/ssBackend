const ReqItemList = require('@ss/models/cmsController/ReqItemList');

const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');

module.exports = async (ctx, next) => {
    const reqItemList = new ReqItemList(ctx.request.body);
    ReqItemList.validModel(reqItemList);

    const itemDao = new ItemDao(ctx.$dbMongo);
    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);

    const itemList = await itemDao.findAll();
    const itemMaterialList = await itemMaterialDao.findAll();
    const itemCategoryList = await itemCategoryDao.findAll();

    ctx.status = 200;
    ctx.body.data = { itemList, itemMaterialList, itemCategoryList };
    await next();
}