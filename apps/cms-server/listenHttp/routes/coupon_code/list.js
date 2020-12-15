const ReqCouponCodeList = require('@ss/models/cmsController/ReqCouponCodeList');

const CouponCodeDao = require('@ss/daoMongo/CouponCodeDao');
const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(couponCodeList) {
    for(const couponCode of couponCodeList) {
        DateUtil.utsToDsObj(couponCode, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const reqCouponCodeList = new ReqCouponCodeList(ctx.request.body);
    ReqCouponCodeList.validModel(reqCouponCodeList);

    const couponId = reqCouponCodeList.getCouponId();
    
    const couponCodeDao = new CouponCodeDao(ctx.$dbMongo);
    const couponCodeList = await couponCodeDao.findMany({couponId});

    utsToDsObj(couponCodeList);
    
    ctx.status = 200;
    ctx.body.data = { couponCodeList };
    await next();
}