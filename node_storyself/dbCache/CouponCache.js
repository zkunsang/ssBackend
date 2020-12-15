const dbMongo = require('../dbMongo');
const CouponDao = require('../daoMongo/CouponDao');

const Coupon = require('../models/mongo/Coupon');
const Cache =require('./Cache');

const ArrayUtil = require('../util/ArrayUtil');

const tableId = 'coupon';

class CouponCacheModel {
    constructor() {
        this.couponList = null;
        this.couponMap = null;
    }

    async loadData(couponDao) {
        this.couponList = await couponDao.findAll();

        this.parseCoupon();
    }

    parseCoupon() {
        this.couponMap = ArrayUtil.keyBy(this.couponList, Coupon.Schema.COUPON_ID.key);
    }

    get(couponId) {
        return this.couponMap[couponId];
    }    
}

class CouponCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = CouponCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new CouponDao(dbMongo);
    }

    get(couponId) {
        return this.currentCacheModel.get(couponId);
    }
}

module.exports = new CouponCache();