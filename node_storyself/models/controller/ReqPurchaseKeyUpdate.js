const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
  PURCHASE_KEY: { key: 'purchaseKey', required: true, type: ValidType.STRING },
  ORDER_ID: { key: 'orderId', required: true, type: ValidType.STRING }
}

class ReqPurchaseKeyUpdate extends Model {
  constructor({ productId, purchaseKey, orderId }) {
    super();

    this[Schema.PRODUCT_ID.key] = productId;
    this[Schema.PURCHASE_KEY.key] = purchaseKey;
    this[Schema.ORDER_ID.key] = orderId;
  }

  getProductId() {
    return this[Schema.PRODUCT_ID.key];
  }

  getOrderId() {
    return this[Schema.ORDER_ID.key];
  }

  getPurchaseKey() {
    return this[Schema.PURCHASE_KEY.key];
  }
}

module.exports = ReqPurchaseKeyUpdate;
module.exports.Schema = Schema;