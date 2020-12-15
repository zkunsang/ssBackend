const CouponCode = require("../models/mongo/CouponCode");
const Dao = require('./Dao');

class CouponCodeDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('cms');
        this.collection = this.db.collection('couponCode');
    }

    static model = CouponCode;

    static requireInsertFieldList() {
        return [
            CouponCode.Schema.COUPON_ID.key,
            CouponCode.Schema.COUPON_CODE.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            CouponCode.Schema.UID.key,
            CouponCode.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            CouponCode.Schema.COUPON_ID.key,
            CouponCode.Schema.COUPON_CODE.key,
        ]
    };
}

module.exports = CouponCodeDao;