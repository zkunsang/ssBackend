const ReqCommonResourceUpdate = require('@ss/models/cmsController/ReqCommonResourceUpdate');

const CommonResource = require('@ss/models/mongo/CommonResource');
const CommonResourceDao = require('@ss/daoMongo/CommonResourceDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqCommonResourceUpdate = new ReqCommonResourceUpdate(ctx.request.body);
    ReqCommonResourceUpdate.validModel(reqCommonResourceUpdate);

    const commonResourceDao = new CommonResourceDao(ctx.$dbMongo);

    const updateList = CommonResourceDao.mappingList(reqCommonResourceUpdate.getUpdateList()); 
    const insertList = CommonResourceDao.mappingList(reqCommonResourceUpdate.getInsertList());

    console.log(updateList);
    console.log(insertList);

    await updateResourceList(commonResourceDao, updateList, updateDate);
    await insertResourceList(commonResourceDao, insertList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function updateResourceList(commonResourceDao, updateList, updateDate) {
    for (const updateItem of updateList) {
        const resourceId = updateItem.getResourceId();
        updateItem.setUpdateDate(updateDate);

        delete updateItem[CommonResource.Schema.RESOURCE_ID.key];

        await commonResourceDao.updateOne({ resourceId }, updateItem);
    }
}

async function insertResourceList(resourceDao, insertList, updateDate) {
    for (const insertItem of insertList) {
        insertItem.setUpdateDate(updateDate);
    }
    await resourceDao.insertMany(insertList);
}