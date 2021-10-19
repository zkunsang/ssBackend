const ReqResourceUpdate = require("@ss/models/cmsController/ReqResourceUpdate");

const moment = require("moment");
const TZResourceDao = require("@ss/daoMongo/TZResourceDao");
const Resource = require("@ss/models/mongo/Resource");

module.exports = async (ctx, next) => {
  const updateDate = moment().unix();
  const reqStoryUpdate = new ReqResourceUpdate(ctx.request.body);
  ReqResourceUpdate.validModel(reqStoryUpdate);

  const insertList = TZResourceDao.mappingList(reqStoryUpdate.getInsertList());
  const updateList = TZResourceDao.mappingList(reqStoryUpdate.getUpdateList());

  const resourceDao = new TZResourceDao(ctx.$dbMongo);

  await updateResourceList(resourceDao, updateList, updateDate);
  await insertResourceList(resourceDao, insertList, updateDate);

  ctx.status = 200;
  ctx.body.data = {};
  await next();
};

async function updateResourceList(resourceDao, updateList, updateDate) {
  for (const updateItem of updateList) {
    const storyId = updateItem.getStoryId();
    const resourceId = updateItem.getResourceId();
    updateItem.setUpdateDate(updateDate);

    delete updateItem[Resource.Schema.STORY_ID.key];
    delete updateItem[Resource.Schema.RESOURCE_ID.key];

    await resourceDao.updateOne({ storyId, resourceId }, updateItem);
  }
}

async function insertResourceList(resourceDao, insertList, updateDate) {
  for (const insertItem of insertList) {
    insertItem.setUpdateDate(updateDate);
  }
  await resourceDao.insertMany(insertList);
}
