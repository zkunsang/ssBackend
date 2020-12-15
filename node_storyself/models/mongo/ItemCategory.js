const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING,  },
    CATEGORY_NAME: { key: 'categoryName', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class ItemCategory extends Model {
    constructor({ itemCategory, categoryName }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = ValidateUtil.setNullUndefined(itemCategory);
        this[Schema.CATEGORY_NAME.key] = ValidateUtil.setNullUndefined(categoryName);
    }
    
    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getItemCategory() {
        return this[Schema.ITEM_CATEGORY.key];
    }

    
}

module.exports = ItemCategory;
module.exports.Schema = Schema;