const ReqCouponCodeInsert = require('@ss/models/cmsController/ReqCouponCodeInsert');

const CouponCode = require('@ss/models/mongo/CouponCode');
const CouponCodeDao = require('@ss/daoMongo/CouponCodeDao');

function createCouponCode(couponCodeList) {
    const retList = [];
    for(const couponCode of couponCodeList) {
        retList.push(new CouponCode(couponCode));
    }

    return retList;
}

module.exports = async (ctx, next) => {
    const reqCouponCodeInsert = new ReqCouponCodeInsert(ctx.request.body);
    ReqCouponCodeInsert.validModel(reqCouponCodeInsert);

    const couponId = reqCouponCodeInsert.getCouponId();
    const couponCodeList = reqCouponCodeInsert.getCouponCodeList();

    const couponCodeDao = new CouponCodeDao(ctx.$dbMongo);
    // const andQuery = {"$and": [
    //     {couponId},
    //     {"$ne": {uid: null}}
    // ]}

    await couponCodeDao.deleteAll();
    await couponCodeDao.insertMany(createCouponCode(couponCodeList));

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}