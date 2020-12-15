const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING },
    USER_LIMIT: { key: 'userLimit', required: true, type: ValidType.NUMBER },
    START_DATE: { key: 'startDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Coupon extends Model {
    constructor({ couponId, userLimit, startDate, endDate }) {
        super();

        this[Schema.COUPON_ID.key] = ValidateUtil.setNullUndefined(couponId);
        this[Schema.USER_LIMIT.key] = ValidateUtil.setNullUndefined(userLimit);
        this[Schema.START_DATE.key] = ValidateUtil.setNullUndefined(startDate);
        this[Schema.END_DATE.key] = ValidateUtil.setNullUndefined(endDate);
    }

    getCouponId() {
        return this[Schema.COUPON_ID.key];
    }
}

module.exports = Coupon;
module.exports.Schema = Schema;