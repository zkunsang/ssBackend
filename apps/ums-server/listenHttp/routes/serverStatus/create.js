const DateUtil = require('@ss/util/DateUtil');
const ReqServerStatusCreate = require('@ss/models/umsController/ReqServerStatusCreate');
const ServerStatusDao = require('@ss/daoRedis/ServerStatusDao');
const dbRedisPB = require('@ss/dbRedisPB');


module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqServerStatusCreate = new ReqServerStatusCreate(ctx.request.body);
    ReqServerStatusCreate.validModel(reqServerStatusCreate);
    
    const serverStatus = reqServerStatusCreate;

    const serverStatusRedisDao = new ServerStatusDao(dbRedisPB);

    serverStatusRedisDao.publish(serverStatus);
    serverStatusRedisDao.set(serverStatus);

    ctx.status = 200;
    ctx.body.data = { serverStatus };

    await next();
};