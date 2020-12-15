const CouponDao = require('@ss/daoMongo/CouponDao');
const CouponRewardDao = require('@ss/daoMongo/CouponRewardDao');
const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.utsToDsObj(dataTable, 'endDate');
        DateUtil.utsToDsObj(dataTable, 'startDate');
    }
}

module.exports = async (ctx, next) => {
    const couponDao = new CouponDao(ctx.$dbMongo);
    const couponList = await couponDao.findAll();

    const couponRewardDao = new CouponRewardDao(ctx.$dbMongo);
    const couponRewardList = await couponRewardDao.findAll();

    utsToDsObj(couponList);
    
    ctx.status = 200;
    ctx.body.data = { couponList, couponRewardList };
    await next();
}