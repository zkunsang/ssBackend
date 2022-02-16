const ReqResourceDeleteMany = require('@ss/models/cmsController/ReqResourceDeleteMany');
const ResourceIosDao = require('@ss/daoMongo/ResourceIosDao');

module.exports = async (ctx, next) => {
  const reqResourceDelete = new ReqResourceDeleteMany(ctx.request.body);
  ReqResourceDeleteMany.validModel(reqResourceDelete);

  const storyId = reqResourceDelete.getStoryId();

  const resourceDao = new ResourceIosDao(ctx.$dbMongo);
  const resourceList = await resourceDao.findMany({ storyId });

  for (let resource of resourceList) {
    if (resource.resourceId.startsWith("netc")) continue;
    await resourceDao.deleteOne({ storyId: resource.storyId, resourceId: resource.resourceId });
  }

  ctx.status = 200;
  ctx.body.data = [];
  await next();
}