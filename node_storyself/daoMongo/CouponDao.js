const Coupon = require("../models/mongo/Coupon");
const Dao = require('./Dao');

class CouponDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('cms');
        this.collection = this.db.collection('coupon');
    }

    static model = Coupon;

    static requireInsertFieldList() {
        return [
            Coupon.Schema.COUPON_ID.key,
            Coupon.Schema.USER_LIMIT.key,
            Coupon.Schema.END_DATE.key,
            Coupon.Schema.START_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Coupon.Schema.USER_LIMIT.key,
            Coupon.Schema.START_DATE.key,
            Coupon.Schema.END_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = CouponDao;