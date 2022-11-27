const ReqVersionUpdate = require('@ss/models/cmsController/ReqVersionUpdate');

const ServiceVariableDao = require('@ss/daoMongo/ServiceVariableDao');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');
const VariableKey = ServiceVariable.VariableKey;

const moment = require('moment');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

module.exports = async (ctx, next) => {
    const updateDate = moment().unix();
    const reqVersionUpdate = new ReqVersionUpdate(ctx.request.body);
    ReqVersionUpdate.validModel(reqVersionUpdate);
    
    const key = getOSType(reqVersionUpdate.getOSType());
    const value = reqVersionUpdate.getVersion();

    const serviceVaraibleDao = new ServiceVariableDao(ctx.$dbMongo);
    const versionInfo = await serviceVaraibleDao.findOne({ key });
    if (versionInfo) await serviceVaraibleDao.updateOne({ key }, { value, updateDate });
    else await serviceVaraibleDao.insertOne(new ServiceVariable({ key, value, updateDate }));

    dbRedisPB.publish(Channels.serverVariable, 'need refresh');
    
    ctx.status = 200;
    ctx.body.data = {};

    await next();
}

const getOSType = (reqVersionUpdate) => {
  
  if(reqVersionUpdate.getOSType() == "aos") {
    return VariableKey.aosAppVersion;
  }
  
  if(reqVersionUpdate.getOSType() == "ios") {
    return VariableKey.iosAppVersion;
  }

  if(reqVersionUpdate.getOSType() == "kt") {
    return VariableKey.ktAppVersion;
  }

  throw new Error("Get os type Error");
}
