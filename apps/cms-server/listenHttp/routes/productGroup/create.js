const ReqProductGroupCreate = require('@ss/models/cmsController/ReqProductGroupCreate');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');
const ProductGroup = require('@ss/models/mongo/ProductGroup');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductGroupCreate = new ReqProductGroupCreate(ctx.request.body);
    ReqProductGroupCreate.validModel(reqProductGroupCreate);

    const groupId = reqProductGroupCreate.getGroupId();
    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const groupInfo = await productGroupDao.findOne({ groupId });

    if (groupInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist' };
        await next();
        return;
    }

    const createGroupInfo = new ProductGroup(reqProductGroupCreate);
    createGroupInfo.setUpdateDate(updateDate);

    await productGroupDao.insertOne(createGroupInfo);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}