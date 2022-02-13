const ReqResourceList = require("@ss/models/cmsController/ReqResourceList");
const ResourceDao = require("@ss/daoMongo/ResourceDao");
const moment = require("moment");
const Resource = require("@ss/models/mongo/Resource");

const DateUtil = require("@ss/util/DateUtil");

async function resetCrc32(resourceDao, updateList, updateDate) {
  for (const updateItem of updateList) {
    const storyId = updateItem.getStoryId();
    const resourceId = updateItem.getResourceId();

    updateItem.setUpdateDate(updateDate);
    updateItem.crc32 = updateItem.crc32 + "n";

    delete updateItem[Resource.Schema.STORY_ID.key];
    delete updateItem[Resource.Schema.RESOURCE_ID.key];

    await resourceDao.updateOne({ storyId, resourceId }, updateItem);
  }
}

module.exports = async (ctx, next) => {
  const updateDate = moment().unix();
  const reqResourceList = new ReqResourceList(ctx.request.body);
  ReqResourceList.validModel(reqResourceList);

  const resourceDao = new ResourceDao(ctx.$dbMongo);
  const resourceList = await resourceDao.findMany({
    storyId: reqResourceList.getStoryId(),
  });

  await resetCrc32(resourceDao, resourceList, updateDate);
  // story 관련 리소스 삭제

  ctx.status = 200;
  ctx.body.data = resourceList || [];
  await next();
};
