const ReqProductGroupUpdate = require('@ss/models/cmsController/ReqProductGroupUpdate');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');
const ProductGroup = require('@ss/models/mongo/ProductGroup');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductGroupUpdate = new ReqProductGroupUpdate(ctx.request.body);
    ReqProductGroupUpdate.validModel(reqProductGroupUpdate);

    const groupId = reqProductGroupUpdate.getGroupId();
    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const findGroupInfo = await productGroupDao.findOne({ groupId });

    if (!findGroupInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exsit group' };
        await next();
        return;
    }

    const productGroup = new ProductGroup(reqProductGroupUpdate);
    productGroup.setUpdateDate(updateDate);
    delete productGroup[ProductGroup.Schema.GROUP_ID.key];

    await productGroupDao.updateOne({ groupId }, productGroup)

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}