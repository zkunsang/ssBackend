const ReqProductList = require('@ss/models/cmsController/ReqProductList');

const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');

const ItemDao = require('@ss/daoMongo/ItemDao');

module.exports = async (ctx, next) => {
    const reqItemList = new ReqProductList(ctx.request.body);
    ReqProductList.validModel(reqItemList);

    const productDao = new ProductDao(ctx.$dbMongo);
    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);
    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);

    const itemDao = new ItemDao(ctx.$dbMongo);

    const itemList = await itemDao.findAll();
    const productList = await productDao.findAll();
    const productRewardList = await productRewardDao.findAll();
    const productGroupList = await productGroupDao.findAll();

    ctx.status = 200;
    ctx.body.data = { itemList, productList, productRewardList, productGroupList };
    await next();
}