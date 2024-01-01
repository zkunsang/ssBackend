const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// TODO: file prefix 정의하기
const Schema = {
    ITEM_LIST: { key: 'itemList', required: true, type: ValidType.ARRAY }
}

class ReqAIDelete extends Model {
    constructor({ itemList }) {
        super();

        this[Schema.ITEM_LIST.key] = itemList
    }

    getItemList() {
        return this[Schema.ITEM_LIST.key]
    }
}

module.exports = ReqAIDelete;
module.exports.Schema = Schema;