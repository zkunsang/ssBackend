const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_INFO: { key: 'couponInfo', required: true, type: ValidType.OBJECT },
    COUPON_REWARD_LIST: { key: 'couponRewardList', required: false, type: ValidType.ARRAY },
    
}

class ReqCouponUpdate extends Model {
    constructor({ couponInfo, couponRewardList }) {
        super();

        this[Schema.COUPON_INFO.key] = couponInfo;
        this[Schema.COUPON_REWARD_LIST.key] = couponRewardList;
    }

    getCouponInfo() {
        return this[Schema.COUPON_INFO.key];
    }

    getCouponRewardList() {
        return this[Schema.COUPON_REWARD_LIST.key];
    }
}

module.exports = ReqCouponUpdate;
module.exports.Schema = Schema;