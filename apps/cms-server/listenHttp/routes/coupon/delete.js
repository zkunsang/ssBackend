const ReqCouponDelete = require('@ss/models/cmsController/ReqCouponDelete');

const Coupon = require('@ss/models/mongo/Coupon');
const CouponDao = require('@ss/daoMongo/CouponDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqCouponDelete = new ReqCouponDelete(ctx.request.body);
    ReqCouponDelete.validModel(reqCouponDelete);

    const couponId = reqCouponDelete.getCouponId();
    
    const couponDao = new CouponDao(ctx.$dbMongo);

    const couponInfo = await couponDao.findOne({couponId});
    if (!couponInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exist item' };    
        await next();
        return;
    }

    await couponDao.deleteOne({couponId});

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}