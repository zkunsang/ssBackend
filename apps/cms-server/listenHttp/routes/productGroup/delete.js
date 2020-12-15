const ReqProductGroupDelete = require('@ss/models/cmsController/ReqProductGroupDelete');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');

module.exports = async (ctx, next) => {
    const reqProductGroupDelete = new ReqProductGroupDelete(ctx.request.body);
    ReqProductGroupDelete.validModel(reqProductGroupDelete);

    const groupId = reqProductGroupDelete.getGroupId();
    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const findGroupInfo = await productGroupDao.findOne({ groupId });

    if (!findGroupInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exist category' };
        await next();
        return;
    }

    await productGroupDao.deleteOne({groupId});

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}