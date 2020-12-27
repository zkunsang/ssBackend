const TempEventDao = require('@ss/daoRedis/TempEventDao');
const dbRedisPB = require('@ss/dbRedisPB');


module.exports = async (ctx, next) => {
    // TODO: Mongo list
    const tempEventDao = new TempEventDao(dbRedisPB);
    // const serverStatusMongoDao = new ServerStatusMongoDao(dbMongo);

    const tempEvent = await tempEventDao.get();
    // const serverStatusList = await ServerStatusMongoDao.findAll();
    ctx.status = 200;
    ctx.body.data = { tempEvent };

    await next();
};