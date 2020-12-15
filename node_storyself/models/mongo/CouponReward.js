const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
}

class CouponReward extends Model {
    constructor({ couponId, itemId, itemQny }) {
        super();

        this[Schema.COUPON_ID.key] = ValidateUtil.setNullUndefined(couponId);
        this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
        this[Schema.ITEM_QNY.key] = ValidateUtil.setNullUndefined(itemQny);
    }
}

module.exports = CouponReward;
module.exports.Schema = Schema;