const ReqProductCreate = require('@ss/models/cmsController/ReqProductCreate');
const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');

const Product = require('@ss/models/mongo/Product');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductCreate = new ReqProductCreate(ctx.request.body);
    ReqProductCreate.validModel(reqProductCreate);

    const productDao = new ProductDao(ctx.$dbMongo);
    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);

    const product = new Product(reqProductCreate.getProductInfo());
    const productRewardList = ProductRewardDao.mappingList(reqProductCreate.getProductRewardList());

    const productId = product.getProductId();
    const findProduct = await productDao.findOne({ productId });

    if (findProduct) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist item' };
        await next();
        return;
    }

    const findRewardList = await productRewardDao.findMany({ productId });

    if (findRewardList.length > 0) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist reward item' };
        await next();
        return;
    }

    await insertProductInfo(productDao, product, updateDate);
    await insertProductRewardInfo(productRewardDao, product, productRewardList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertProductInfo(productDao, product, updateDate) {
    product.setUpdateDate(updateDate);
    await productDao.insertOne(product)
}

async function insertProductRewardInfo(productRewardDao, product, productRewardList, updateDate) {
    const productId = product.getProductId();
    productRewardList.map((item) => {
        item.setUpdateDate(updateDate)
        item.setProductId(productId);
    });
    await productRewardDao.insertMany(productRewardList);
}