const DateUtil = require('@ss/util/DateUtil');
const ReqIPDelete = require('@ss/models/umsController/ReqIPDelete');
const IP = require('@ss/models/mongo/IP');
const IPDao = require('@ss/daoMongo/IPDao');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

module.exports = async (ctx, next) => {
    const reqIPDelete = new ReqIPDelete(ctx.request.body);
    ReqIPDelete.validModel(reqIPDelete);

    const ip = reqIPDelete.getIP();
    const type = reqIPDelete.getType();

    const ipDao = new IPDao(ctx.$dbMongo);
    await ipDao.deleteOne({ip, type});
    

    
    dbRedisPB.publish(Channels.ipList, 'refresh');
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}