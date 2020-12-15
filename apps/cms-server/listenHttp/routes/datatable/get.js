const ReqDataTableGet = require('@ss/models/cmsController/ReqDataTableGet');

const DataTableVersionHelper = require('@ss/helper/dataTableVersionHelper');

module.exports = async (ctx, next) => {
    const reqDataTableGet = new ReqDataTableGet(ctx.request.body);
    ReqDataTableGet.validModel(reqDataTableGet);

    const tableId = reqDataTableGet.getTableId();
    let versionInfo = await DataTableVersionHelper.getTableVersionInfo(ctx, tableId);
    versionInfo = versionInfo;
    
    ctx.status = 200;
    ctx.body.data = { versionInfo };
    await next();
}