const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_INFO: { key: 'productInfo', required: true, type: ValidType.OBJECT },
    PRODUCT_REWARD_LIST: { key: 'productRewardList', required: true, type: ValidType.ARRAY },
}

class ReqProductUpdate extends Model {
    constructor({ productInfo, productRewardList }) {
        super();
        this[Schema.PRODUCT_INFO.key] = productInfo;
        this[Schema.PRODUCT_REWARD_LIST.key] = productRewardList;
    }

    getProductInfo() {
        return this[Schema.PRODUCT_INFO.key];
    }

    getProductRewardList() {
        return this[Schema.PRODUCT_REWARD_LIST.key];
    }
}

module.exports = ReqProductUpdate;
module.exports.Schema = Schema;