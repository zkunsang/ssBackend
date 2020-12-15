const ReqProductUpdate = require('@ss/models/cmsController/ReqProductUpdate');
const Product = require('@ss/models/mongo/Product')

const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductUpdate = new ReqProductUpdate(ctx.request.body);
    ReqProductUpdate.validModel(reqProductUpdate);

    const productDao = new ProductDao(ctx.$dbMongo);
    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);

    const productInfo = new Product(reqProductUpdate.getProductInfo());
    const productRewardList = reqProductUpdate.getProductRewardList();

    const productId = productInfo.getProductId();
    const findProductInfo = await productDao.findOne({ productId });

    if (!findProductInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'not exist item' };
        await next();
        return;
    }

    productInfo.setUpdateDate(updateDate);
    delete productInfo[Product.Schema.PRODUCT_ID.key];

    await productDao.updateOne({ productId }, productInfo);

    const rewardList = await productRewardDao.findMany({ productId });
    await productRewardDao.deleteMany({ productId }, rewardList.length);

    await insertProductReward(productRewardDao, productId, productRewardList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertProductReward(productRewardDao, productId, list, updateDate) {
    const rewardList = ProductRewardDao.mappingList(list);
    rewardList.map((item) => {
        item.setProductId(productId);
        item.setUpdateDate(updateDate)
    });
    await productRewardDao.insertMany(rewardList);
}