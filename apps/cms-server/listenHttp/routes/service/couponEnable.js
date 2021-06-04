const ReqServiceCouponEnable = require('@ss/models/cmsController/ReqServiceCouponEnable');
const ServiceVariableDao = require('@ss/daoMongo/ServiceVariableDao');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');

const moment = require('moment');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;
const VariableKey = ServiceVariable.VariableKey;

module.exports = async (ctx, next) => {
    const updateDate = moment().unix();
    const reqServiceCouponEnable = new ReqServiceCouponEnable(ctx.request.body);
    ReqServiceCouponEnable.validModel(reqServiceCouponEnable);

    const couponEnable = reqServiceCouponEnable.getCouponEnable();
    const platform = reqServiceCouponEnable.getPlatform();
    const version = reqServiceCouponEnable.getClientVersion();

    const serviceVariableDao = new ServiceVariableDao(ctx.$dbMongo);

    const key = `${platform}_${version}_couponenable`;
    const value = couponEnable ? couponEnable : false;
    const versionInfo = await serviceVariableDao.findOne({ key });

    if (versionInfo) await serviceVariableDao.updateOne({ key }, { value, updateDate });
    else await serviceVariableDao.insertOne(new ServiceVariable({ key, value, updateDate }));

    dbRedisPB.publish(Channels.serverVariable, 'need refresh');

    ctx.status = 200;
    ctx.body.data = {};

    await next();

}