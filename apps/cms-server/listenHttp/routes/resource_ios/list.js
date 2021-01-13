const ReqResourceIosList = require('@ss/models/cmsController/ReqResourceIosList');
const ResourceIosDao = require('@ss/daoMongo/ResourceIosDao');

const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const reqResourceList = new ReqResourceIosList(ctx.request.body);
    ReqResourceIosList.validModel(reqResourceList);

    const resourceDao = new ResourceIosDao(ctx.$dbMongo);
    const resourceList = await resourceDao.findMany({ storyId: reqResourceList.getStoryId() });

    utsToDsObj(resourceList);

    ctx.status = 200;
    ctx.body.data = resourceList || [];
    await next();
}