const ReqServiceServerMessage = require('@ss/models/cmsController/ReqServiceServerMessage');
const ServiceVariableDao = require('@ss/daoMongo/ServiceVariableDao');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');

const moment = require('moment');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

module.exports = async (ctx, next) => {
    const updateDate = moment().unix();
    const reqServiceServerMessage = new ReqServiceServerMessage(ctx.request.body);
    ReqServiceServerMessage.validModel(reqServiceServerMessage);

    const platform = reqServiceServerMessage.getPlatform();
    const version = reqServiceServerMessage.getClientVersion();
    const serverMessage = reqServiceServerMessage.getServerMessage();

    const serviceVariableDao = new ServiceVariableDao(ctx.$dbMongo);

    const key = `${platform}_${version}`;
    const value = serverMessage ? serverMessage : "";
    const versionInfo = await serviceVariableDao.findOne({ key });

    if (versionInfo) await serviceVariableDao.updateOne({ key }, { value, updateDate });
    else await serviceVariableDao.insertOne(new ServiceVariable({ key, value, updateDate }));

    dbRedisPB.publish(Channels.serverVariable, 'need refresh');

    ctx.status = 200;
    ctx.body.data = {};

    await next();

}