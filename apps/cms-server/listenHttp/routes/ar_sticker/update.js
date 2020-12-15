const ReqARStickerResourceUpdate = require('@ss/models/cmsController/ReqARStickerResourceUpdate');

const ARStickerResource = require('@ss/models/mongo/ARStickerResource');
const ARStickerResourceDao = require('@ss/daoMongo/ARStickerResourceDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqARStickerUpdate = new ReqARStickerResourceUpdate(ctx.request.body);
    ReqARStickerResourceUpdate.validModel(reqARStickerUpdate);

    const dnnResourceDao = new ARStickerResourceDao(ctx.$dbMongo);

    const updateList = ARStickerResourceDao.mappingList(reqARStickerUpdate.getUpdateList()); 
    const insertList = ARStickerResourceDao.mappingList(reqARStickerUpdate.getInsertList());

    console.log(updateList);
    console.log(insertList);

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

        delete updateItem[ARStickerResource.Schema.RESOURCE_ID.key];

        await dnnResourceDao.updateOne({ resourceId }, updateItem);
    }
}

async function insertResourceList(resourceDao, insertList, updateDate) {
    for (const insertItem of insertList) {
        insertItem.setUpdateDate(updateDate);
    }
    await resourceDao.insertMany(insertList);
}