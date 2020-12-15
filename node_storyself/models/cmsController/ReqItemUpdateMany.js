const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_LIST: { key: 'itemList', required: true, type: ValidType.ARRAY }
}

class ReqItemUpdateMany extends Model {
    constructor({ itemList }) {
        super();
        this[Schema.ITEM_LIST.key] = itemList;
    }

    getItemList() {
        return this[Schema.ITEM_LIST.key];
    }
}

module.exports = ReqItemUpdateMany;
module.exports.Schema = Schema;