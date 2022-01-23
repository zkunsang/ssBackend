const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  PRODUCT_ID: { key: "productId", required: true, type: ValidType.STRING },
  PACKAGE_NAME: { key: "packageName", required: true, type: ValidType.STRING },
};

class ReqCheatPurchase extends Model {
  constructor({ productId, packageName }) {
    super();
    this[Schema.PRODUCT_ID.key] = productId;
    this[Schema.PACKAGE_NAME.key] = packageName;
  }

  getProductId() {
    return this[Schema.PRODUCT_ID.key];
  }

  getPackageName() {
    return this[Schema.PACKAGE_NAME.key];
  }
}

module.exports = ReqCheatPurchase;
module.exports.Schema = Schema;
