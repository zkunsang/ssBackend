const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
}

class ReqPurchaseKeyCreate extends Model {
  constructor({ productId }) {
    super();

    this[Schema.PRODUCT_ID.key] = productId;
  }
  getProductId() {
    return this[Schema.PRODUCT_ID.key];
  }
}

module.exports = ReqPurchaseKeyCreate;
module.exports.Schema = Schema;