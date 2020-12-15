const ReqCouponUpdate = require('@ss/models/cmsController/ReqCouponUpdate');

const Coupon = require('@ss/models/mongo/Coupon');
const CouponDao = require('@ss/daoMongo/CouponDao');

const CouponReward = require('@ss/models/mongo/CouponReward');
const CouponRewardDao = require('@ss/daoMongo/CouponRewardDao');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;

function createCouponRewardList(rewardList, couponId) {
    return rewardList.map((item) => {
        item.couponId = couponId;
        return new CouponReward(item);
    });
}

module.exports = async (ctx, next) => {
    const reqCouponUpdate = new ReqCouponUpdate(ctx.request.body);
    ReqCouponUpdate.validModel(reqCouponUpdate);

    const couponInfo = new Coupon(reqCouponUpdate.getCouponInfo());
    const couponId = couponInfo.getCouponId();

    const couponDao = new CouponDao(ctx.$dbMongo);

    const findCouponInfo = await couponDao.findOne({ couponId });
    if (!findCouponInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exist item' };
        await next();
        return;
    }


    delete couponInfo[Coupon.Schema.COUPON_ID.key];

    await couponDao.updateOne({ couponId }, couponInfo);

    const couponRewardDao = new CouponRewardDao(ctx.$dbMongo);

    await couponRewardDao.deleteMany({ couponId });
    const insertList = createCouponRewardList(reqCouponUpdate.getCouponRewardList(), couponId)
    await couponRewardDao.insertMany(insertList);

    dbRedisPB.publish(Channels.coupon, "reload!");

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}