const dbMongo = require('../dbMongo');
const CouponRewardDao = require('../daoMongo/CouponRewardDao');

const CouponReward = require('../models/mongo/CouponReward');
const Cache = require('./Cache');

const ArrayUtil = require('../util/ArrayUtil');

const tableId = 'couponReward';

class CouponRewardModel {
    constructor() {
        this.couponRewardList = null;
        this.couponRewardListByCouponId = null;
    }

    async loadData(couponRewardDao) {
        this.couponRewardList = await couponRewardDao.findAll();

        this.parseCouponReward();
    }

    parseCouponReward() {
        this.couponRewardListByCouponId 
            = ArrayUtil.getMapArrayByKey(
                this.couponRewardList, 
                CouponReward.Schema.COUPON_ID.key);
    }

    get(couponId) {
        return this.couponRewardListByCouponId[couponId];
    }
}

class CouponRewardCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = CouponRewardModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new CouponRewardDao(dbMongo);
    }

    get(couponId) {
        return this.currentCacheModel.get(couponId);
    }
}

module.exports = new CouponRewardCache();