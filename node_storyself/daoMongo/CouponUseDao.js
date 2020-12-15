const CouponUse = require("../models/mongo/CouponUse");
const Dao = require('./Dao');

class CouponUseDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('cms');
        this.collection = this.db.collection('couponUse');
    }

    static model = CouponUse;

    static requireInsertFieldList() {
        return [
            CouponUse.Schema.COUPON_ID.key,
            CouponUse.Schema.COUPON_CODE.key,
            CouponUse.Schema.UID.key,
            CouponUse.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return []
    };

    static notAllowSetFieldList() {
        return [
            CouponUse.Schema.COUPON_ID.key,
            CouponUse.Schema.COUPON_CODE.key,
            CouponUse.Schema.UID.key,
            CouponUse.Schema.UPDATE_DATE.key,
        ]
    };
}

module.exports = CouponUseDao;