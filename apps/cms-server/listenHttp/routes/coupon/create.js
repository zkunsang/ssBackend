const ReqCouponCreate = require('@ss/models/cmsController/ReqCouponCreate');

const Coupon= require('@ss/models/mongo/Coupon');
const CouponDao = require('@ss/daoMongo/CouponDao');

module.exports = async (ctx, next) => {
    const reqCouponCreate = new ReqCouponCreate(ctx.request.body);
    ReqCouponCreate.validModel(reqCouponCreate);

    const couponId = reqCouponCreate.getCouponId();

    const couponDao = new CouponDao(ctx.$dbMongo);
    const couponInfo = await couponDao.findOne({couponId});

    if(couponInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist item' };    
        await next();
        return;
    }

    await couponDao.insertOne(new Coupon(reqCouponCreate));

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}