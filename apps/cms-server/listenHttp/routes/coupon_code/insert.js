const ReqCouponCodeInsert = require('@ss/models/cmsController/ReqCouponCodeInsert');

const CouponCode = require('@ss/models/mongo/CouponCode');
const CouponCodeDao = require('@ss/daoMongo/CouponCodeDao');
const ArrayUtil = require('@ss/util/ArrayUtil');

function createCouponCode(couponCodeList) {
    const retList = [];
    for(const couponCode of couponCodeList) {
        
        retList.push(new CouponCode({ 
            couponId: couponCode.couponId, 
            couponCode: couponCode.couponCode.toString() }));
    }

    return retList;
}

module.exports = async (ctx, next) => {
    const reqCouponCodeInsert = new ReqCouponCodeInsert(ctx.request.body);
    ReqCouponCodeInsert.validModel(reqCouponCodeInsert);

    const couponCodeList = reqCouponCodeInsert.getCouponCodeList();

    const couponCodeDao = new CouponCodeDao(ctx.$dbMongo);
    
    const couponMap = ArrayUtil.getMapArrayByKey(couponCodeList, "couponId");
    const couponIdList = Object.keys(couponMap);

    for(const couponId of couponIdList) {
        const couponList = couponMap[couponId];

        if(!couponList) continue;

        const oldList = await couponCodeDao.findMany({ couponId });
        const { insertList } = ArrayUtil.compareArrayByKey(oldList, couponList, "couponCode");
        await couponCodeDao.insertMany(createCouponCode(insertList));
    }
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}