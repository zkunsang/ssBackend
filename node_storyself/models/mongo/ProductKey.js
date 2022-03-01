const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: 'uid', required: true, type: ValidType.STRING },
  PRODUCT_KEYS: { key: "productKeys", required: true, type: ValidType.OBJECT }
}

class ProductKey extends Model {
  constructor({ uid, productKeys }) {
    super();

    this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
    this[Schema.PRODUCT_KEYS.key] = ValidateUtil.setNullUndefined(productKeys);
  }
}

module.exports = ProductKey;
module.exports.Schema = Schema;