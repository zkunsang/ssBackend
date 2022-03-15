const ValidateUtil = require("../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;
const DateUtil = require("@ss/util/DateUtil");

const Service = require("../service/Service");
const SubscribeCoupon = require('@ss/models/mongo/SubscribeCoupon');

const Schema = {
  UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
  
};

class CouponService extends Service {
  constructor(updateDate) {
    super();

    this[Schema.UPDATE_DATE.key] = updateDate;
  }

  createSubscribeInfo(couponId) {
    const couponIds = couponId.split("_");
    const couponDay = Number(couponIds[1]);
    const expiryTimeMillis = DateUtil.addDay(this[Schema.UPDATE_DATE.key], couponDay);

    return new SubscribeCoupon({ couponId, expiryTimeMillis });
  }
}

module.exports = CouponService;
module.exports.Schema = Schema;