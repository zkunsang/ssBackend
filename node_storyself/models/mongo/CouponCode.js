const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING },
    COUPON_CODE: { key: 'couponCode', required: true, type: ValidType.STRING },
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class CouponCode extends Model {
    constructor({ couponId, couponCode, uid, updateDate }) {
        super();

        this[Schema.COUPON_ID.key] = ValidateUtil.setNullUndefined(couponId);
        this[Schema.COUPON_CODE.key] = ValidateUtil.setNullUndefined(couponCode);
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }
}

module.exports = CouponCode;
module.exports.Schema = Schema;