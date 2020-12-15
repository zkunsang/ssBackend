const DateUtil = require('@ss/util/DateUtil');
const ReqIPCreate = require('@ss/models/umsController/ReqIPCreate');
const IP = require('@ss/models/mongo/IP');
const IPDao = require('@ss/daoMongo/IPDao');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

module.exports = async (ctx, next) => {
    const reqIPCreate = new ReqIPCreate(ctx.request.body);
    ReqIPCreate.validModel(reqIPCreate);

    const updateDate = ctx.$date;
    const dateString = DateUtil.utsToDs(updateDate, 'updateDate')

    const ip = reqIPCreate.getIP();
    const type = reqIPCreate.getType();
    const status = 1;
    const adminId = ctx.$adminInfo.adminId;
    const memo = [`[${dateString}]${reqIPCreate.getMemo()} - ${adminId}`];

    const ipObject = new IP({ip, type, memo, adminId, updateDate, status});

    const ipDao = new IPDao(ctx.$dbMongo);
    await ipDao.insertOne(ipObject);

    dbRedisPB.publish(Channels.ipList, 'refresh');

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}