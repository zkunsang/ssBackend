const ReqResourceIosUpdateMany = require('@ss/models/cmsController/ReqResourceIosUpdateMany');

const moment = require('moment');

const ResourceIosDao = require('@ss/daoMongo/ResourceIosDao');

async function insertResourceList(resourceDao, resourceList, updateDate) {
    const insertResourceList = ResourceIosDao.mappingList(resourceList);
    for(const resource of insertResourceList) {
        resource.setUpdateDate(updateDate);
        resource.crc32 = resource.crc32.toString();
    }

    await resourceDao.insertMany(insertResourceList);
}

module.exports = async (ctx, next) => {
    const updateDate = moment().unix();
    const reqResourceUpdateMany = new ReqResourceIosUpdateMany(ctx.request.body);
    ReqResourceIosUpdateMany.validModel(reqResourceUpdateMany);

    const resourceList = reqResourceUpdateMany.getResourceList();
    const resourceDao = new ResourceIosDao(ctx.$dbMongo);

    await resourceDao.deleteAll();
    await insertResourceList(resourceDao, resourceList, updateDate);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}