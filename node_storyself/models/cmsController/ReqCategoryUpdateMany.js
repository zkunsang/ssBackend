const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    CATEGORY_LIST: { key: 'itemCategory', required: true, type: ValidType.ARRAY, },
}

class ReqCategoryUpdate extends Model {
    constructor({ categoryList }) {
        super();
        this[Schema.CATEGORY_LIST.key] = categoryList;
    }

    getCategoryList() {
        return this[Schema.CATEGORY_LIST.key];
    }
}

module.exports = ReqCategoryUpdate;
module.exports.Schema = Schema;