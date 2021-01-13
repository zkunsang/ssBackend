const ReqResourceIosUpdate = require('@ss/models/cmsController/ReqResourceIosUpdate');

const moment = require('moment');
const ResourceIosDao = require('@ss/daoMongo/ResourceIosDao');
const Resource = require('@ss/models/mongo/Resource');

module.exports = async (ctx, next) => {
    const updateDate = moment().unix();
    const reqStoryUpdate = new ReqResourceIosUpdate(ctx.request.body);
    ReqResourceIosUpdate.validModel(reqStoryUpdate);

    const insertList = ResourceIosDao.mappingList(reqStoryUpdate.getInsertList());
    const updateList = ResourceIosDao.mappingList(reqStoryUpdate.getUpdateList());

    const resourceDao = new ResourceIosDao(ctx.$dbMongo);

    await updateResourceList(resourceDao, updateList, updateDate);
    await insertResourceList(resourceDao, insertList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

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