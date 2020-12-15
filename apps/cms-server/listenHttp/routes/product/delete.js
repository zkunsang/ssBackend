const ReqProductDelete = require('@ss/models/cmsController/ReqProductDelete');
const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');

module.exports = async (ctx, next) => {
    const reqProductDelete = new ReqProductDelete(ctx.request.body);
    ReqProductDelete.validModel(reqProductDelete);

    const productDao = new ProductDao(ctx.$dbMongo);
    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);

    const productId = reqProductDelete.getProductId();
    const findProduct = await productDao.findOne({productId});

    if(!findProduct) {
        ctx.status = 400;
        ctx.body.data = { message: 'not exist product' };    
        await next();
        return;
    }

    await productDao.deleteOne({productId});
    const findRewardList = await productRewardDao.findMany({productId});

    await productRewardDao.deleteMany({productId}, findRewardList.length);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

