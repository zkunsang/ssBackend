const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_GROUP_LIST: { key: 'productGroupList', required: true, type: ValidType.ARRAY, },
}

class ReqProductGroupUpdateMany extends Model {
    constructor({ productGroupList }) {
        super();
        this[Schema.PRODUCT_GROUP_LIST.key] = productGroupList;
    }

    getProductGroupList() {
        return this[Schema.PRODUCT_GROUP_LIST.key];
    }
}

module.exports = ReqProductGroupUpdateMany;
module.exports.Schema = Schema;