const ReqDataTableUpdate = require('@ss/models/cmsController/ReqDataTableUpdate');

const DataTable = require('@ss/models/mongo/DataTable');
const DataTableDao = require('@ss/daoMongo/DataTableDao');

const DataTableVersionHelper = require('@ss/helper/DataTableVersionHelper')
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqDataTableUpdate = new ReqDataTableUpdate(ctx.request.body);
    ReqDataTableUpdate.validModel(reqDataTableUpdate);

    const tableId = reqDataTableUpdate.getTableId();
    const version = reqDataTableUpdate.getVersion();
    const crc32 = reqDataTableUpdate.getCRC32();

    const versionInfo = await DataTableVersionHelper.getTableVersionInfo(ctx, tableId);

    const dataTableDao = new DataTableDao(ctx.$dbMongo);

    if(!versionInfo) {
        // 신규 등록
        await dataTableDao.insertOne(new DataTable({ tableId, "version": '1.0', updateDate, crc32 }));
    }
    else {
        const strVersion = versionInfo.version.toString();
        const versionSplit = strVersion.split(".");
        const majorVersion = parseInt(versionSplit[0]);
        const minorVersion = parseInt(versionSplit[1]) + 1;
        
        const version = (majorVersion + "." + minorVersion).toString();

        await dataTableDao.updateOne({ tableId }, { updateDate, version, crc32 });
    }

    // TODO: channelMessage 에 뭐를 던질지를 고민해보자
    dbRedisPB.publish(Channels.dataTable, 'need refresh');

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}