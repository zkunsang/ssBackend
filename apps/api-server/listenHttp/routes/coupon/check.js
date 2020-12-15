const ReqCouponCheck = require('@ss/models/controller/ReqCouponCheck');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const CouponUseDao = require('@ss/daoMongo/CouponUseDao');
const CouponCodeDao = require('@ss/daoMongo/CouponCodeDao');

const CouponTryDao = require('@ss/daoRedis/CouponTryDao');

const CouponRewardCache = require('@ss/dbCache/CouponRewardCache');
const CouponCache = require('@ss/dbCache/CouponCache');

const InventoryService = require('@ss/service/InventoryService');

const SSError = require('@ss/error');
const DateUtil = require('@ss/util/DateUtil');
const CouponUse = require('@ss/models/mongo/CouponUse');



module.exports = async (ctx, next) => {
    const reqCouponCheck = new ReqCouponCheck(ctx.request.body);
    ReqCouponCheck.validModel(reqCouponCheck);
    
    // 시도 횟수 체크
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const couponTryDao = new CouponTryDao(ctx.$dbRedis);
    const couponTryInfo = await couponTryDao.get(userInfo.uid, DateUtil.getHours());

    if(parseInt(couponTryInfo) >= 5) {
        ctx.$res.badRequest(SSError.Service.Code.couponManyTry);
        await next();
        return;        
    }

    await couponTryDao.set(userInfo.uid, DateUtil.getHours());
    
    const couponCode = reqCouponCheck.getCouponCode();

    const couponCodeDao = new CouponCodeDao(ctx.$dbMongo);
    const couponCodeInfo = await couponCodeDao.findOne({couponCode});

    let couponInfo = null;
    if(!couponCodeInfo) {
        couponInfo = CouponCache.get(couponCode);

        // 쿠폰 정보가 없으면
        if(!couponInfo) {
            ctx.$res.badRequest(SSError.Service.Code.couponNoExist);
            await next();
            return;
        }
    }
    else {
        couponInfo = CouponCache.get(couponCodeInfo.couponId);
        if(!couponInfo) {
            ctx.$res.badRequest(SSError.Service.Code.couponNoExist);
            await next();
            return;
        }
    }

    // 사용 기한 체크
    if(!DateUtil.isBetween(updateDate, couponInfo.startDate, couponInfo.endDate)) {
        ctx.$res.badRequest(SSError.Service.Code.couponUnavailable);
        await next();
        return;
    }

    // 이미 사용한 유저인지 확인
    const couponUseDao = new CouponUseDao(ctx.$dbMongo);
    const couponId = couponInfo.couponId;
    const uid = userInfo.uid;

    const couponUse = await couponUseDao.findOne({ uid, couponId })
    if(couponUse) {
        ctx.$res.badRequest(SSError.Service.Code.couponAlreadyUsed);
        await next();
        return;
    }

    if(couponInfo.userLimit) {
        if(couponCodeInfo.uid) {
            ctx.$res.badRequest(SSError.Service.Code.couponAlreadyOccupied);
            await next();
            return;
        }

        await couponCodeDao.updateOne({ couponId, couponCode }, { uid, updateDate });
    }

    await couponUseDao.insertOne(new CouponUse({uid, couponCode, couponId, updateDate}));
    
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const inventoryService = new InventoryService(inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    const rewardList = CouponRewardCache.get(couponId);

    const putInventoryList = InventoryService.makeInventoryList(rewardList);

    await inventoryService.processPut(
        InventoryService.PUT_ACTION.COUPON,
        putInventoryList);
    
    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);

    ctx.$res.success({ 
        inventoryList: userInventoryList
    });
    
    // helper.fluent.sendLog('login', new LoginLog(reqAuthLogin, { ip: ctx.$res.clientIp, loginDate }));

    await next();
}