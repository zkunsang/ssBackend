const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
  EXPIRE_MILLIS: {
    key: "expiryTimeMillis",
    required: true,
    type: ValidType.NUMBER,
  },
  START_MILLIS: {
    key: "startTimeMillis",
    required: true,
    type: ValidType.NUMBER,
  },
  COUPON_ID: { key: "couponId", required: false, type: ValidType.STRING },
  CANCELLED: {key: "cancelled", required: false, type: ValidType.BOOLEAN}
};

class SubscribeCoupon extends Model {
  constructor({
    startTimeMillis,
    expiryTimeMillis,
    couponId,
    cancelled,
  }) {
    super();

    this[Schema.START_MILLIS.key] = startTimeMillis;
    this[Schema.EXPIRE_MILLIS.key] = expiryTimeMillis;
    this[Schema.COUPON_ID.key] = couponId;    

    this[Schema.CANCELLED.key] = cancelled || false;
  }
  
  hasSubscribe(now) {
    return this[Schema.EXPIRE_MILLIS.key] > now;
  }

  getExpireMillis() {
    return this[Schema.EXPIRE_MILLIS.key];
  }

  cancel(updateDate) {
    this[Schema.CANCELLED.key] = true;
    this[Schema.EXPIRE_MILLIS.key] = updateDate;
  }

  isCancelled() {
    return this[Schema.CANCELLED.key];
  }
}

module.exports = SubscribeCoupon;
module.exports.Schema = Schema;
