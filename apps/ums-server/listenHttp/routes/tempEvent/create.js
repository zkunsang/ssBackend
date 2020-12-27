const DateUtil = require('@ss/util/DateUtil');
const ReqTempEventCreate = require('@ss/models/umsController/ReqTempEventCreate');
const TempEventDao = require('@ss/daoRedis/TempEventDao');
const dbRedisPB = require('@ss/dbRedisPB');


module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqTempEventCreate = new ReqTempEventCreate(ctx.request.body);
    ReqTempEventCreate.validModel(reqTempEventCreate);
    
    const serverStatus = reqTempEventCreate;

    const tempEventDao = new TempEventDao(dbRedisPB);

    tempEventDao.publish(serverStatus);
    tempEventDao.set(serverStatus);

    ctx.status = 200;
    ctx.body.data = { serverStatus };

    await next();
};