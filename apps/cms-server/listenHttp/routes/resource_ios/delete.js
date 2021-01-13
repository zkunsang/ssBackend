const ReqResourceIosDelete = require('@ss/models/cmsController/ReqResourceIosDelete');
const ResourceIosDao = require('@ss/daoMongo/ResourceIosDao');

module.exports = async (ctx, next) => {
    const reqResourceDelete = new ReqResourceIosDelete(ctx.request.body);
    ReqResourceIosDelete.validModel(reqResourceDelete);

    const storyId = reqResourceDelete.getStoryId();
    const resourceId = reqResourceDelete.getResourceId();

    const resourceDao = new ResourceIosDao(ctx.$dbMongo);
    await resourceDao.deleteOne({ storyId, resourceId });
    
    ctx.status = 200;
    ctx.body.data = [];
    await next();
}