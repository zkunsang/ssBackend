const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_LIST: { key: 'productList', required: true, type: ValidType.ARRAY },
}

class ReqProductUpdateMany extends Model {
    constructor({ productList }) {
        super();
        this[Schema.PRODUCT_LIST.key] = productList;
    }

    getProductList() {
        return this[Schema.PRODUCT_LIST.key];
    }
}

module.exports = ReqProductUpdateMany;
module.exports.Schema = Schema;