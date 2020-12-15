const CouponReward = require("../models/mongo/CouponReward");
const Dao = require('./Dao');

class CouponRewardDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('cms');
        this.collection = this.db.collection('couponReward');
    }

    static model = CouponReward;

    static requireInsertFieldList() {
        return [
            CouponReward.Schema.COUPON_ID.key,
            CouponReward.Schema.ITEM_QNY.key,
            CouponReward.Schema.ITEM_QNY.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return []
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = CouponRewardDao;