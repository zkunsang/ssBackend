const ReqDNNResourceUpdate = require('@ss/models/cmsController/ReqDNNResourceUpdate');

const DNNResource = require('@ss/models/mongo/DNNResource');
const DNNResourceDao = require('@ss/daoMongo/DNNResourceDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqCommonResourceUpdate = new ReqDNNResourceUpdate(ctx.request.body);
    ReqDNNResourceUpdate.validModel(reqCommonResourceUpdate);

    const dnnResourceDao = new DNNResourceDao(ctx.$dbMongo);

    const updateList = DNNResourceDao.mappingList(reqCommonResourceUpdate.getUpdateList());
    const insertList = DNNResourceDao.mappingList(reqCommonResourceUpdate.getInsertList());

    await updateResourceList(dnnResourceDao, updateList, updateDate);
    await insertResourceList(dnnResourceDao, insertList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function updateResourceList(dnnResourceDao, updateList, updateDate) {
    for (const updateItem of updateList) {
        const resourceId = updateItem.getResourceId();
        updateItem.setUpdateDate(updateDate);

        delete updateItem[DNNResource.Schema.RESOURCE_ID.key];

        await dnnResourceDao.updateOne({ resourceId }, updateItem);
    }
}

async function insertResourceList(resourceDao, insertList, updateDate) {
    for (const insertItem of insertList) {
        insertItem.setUpdateDate(updateDate);
    }
    await resourceDao.insertMany(insertList);
}