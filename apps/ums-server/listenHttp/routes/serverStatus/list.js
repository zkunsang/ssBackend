const ServerStatusDao = require('@ss/daoRedis/ServerStatusDao');
const dbRedisPB = require('@ss/dbRedisPB');


module.exports = async (ctx, next) => {
    // TODO: Mongo list
    const serverStatusRedisDao = new ServerStatusDao(dbRedisPB);
    // const serverStatusMongoDao = new ServerStatusMongoDao(dbMongo);

    const serverStatus = await serverStatusRedisDao.get();
    // const serverStatusList = await ServerStatusMongoDao.findAll();
    ctx.status = 200;
    ctx.body.data = { serverStatus };

    await next();
};