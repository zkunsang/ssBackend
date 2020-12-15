const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING, },
    CATEGORY_NAME: { key: 'categoryName', required: true, type: ValidType.STRING },
}

class ReqCategoryUpdate extends Model {
    constructor({ itemCategory, categoryName }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.CATEGORY_NAME.key] = categoryName;
    }

    getItemCategory() {
        return this[Schema.ITEM_CATEGORY.key];
    }
}

module.exports = ReqCategoryUpdate;
module.exports.Schema = Schema;