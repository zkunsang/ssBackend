const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING, },
}

class ReqCategoryDelete extends Model {
    constructor({ itemCategory }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
    }

    getItemCategory() {
        return this[Schema.ITEM_CATEGORY.key];
    }
}

module.exports = ReqCategoryDelete;
module.exports.Schema = Schema;