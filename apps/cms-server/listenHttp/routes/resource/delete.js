const ReqResourceDelete = require('@ss/models/cmsController/ReqResourceDelete');
const ResourceDao = require('@ss/daoMongo/ResourceDao');

module.exports = async (ctx, next) => {
    const reqResourceDelete = new ReqResourceDelete(ctx.request.body);
    ReqResourceDelete.validModel(reqResourceDelete);

    const storyId = reqResourceDelete.getStoryId();
    const resourceId = reqResourceDelete.getResourceId();

    const resourceDao = new ResourceDao(ctx.$dbMongo);
    const delResult = await resourceDao.deleteOne({ storyId, resourceId });
    
    ctx.status = 200;
    ctx.body.data = [];
    await next();
}