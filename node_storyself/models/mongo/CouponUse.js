const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    COUPON_ID: { key: 'couponId', required: true, type: ValidType.STRING },
    COUPON_CODE: { key: 'couponCode', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class CouponUse extends Model {
    constructor({ uid, couponId, couponCode, updateDate }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.COUPON_ID.key] = ValidateUtil.setNullUndefined(couponId);
        this[Schema.COUPON_CODE.key] = ValidateUtil.setNullUndefined(couponCode);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }
}

module.exports = CouponUse;
module.exports.Schema = Schema;