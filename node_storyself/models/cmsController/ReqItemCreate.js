const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_INFO: { key: 'itemInfo', required: true, type: ValidType.OBJECT },
    MATERIAL_ITEM_LIST: { key: 'materialItemList', required: true, type: ValidType.ARRAY },
}

class ReqItemCreate extends Model {
    constructor({ itemInfo, materialItemList }) {
        super();
        this[Schema.ITEM_INFO.key] = itemInfo;
        this[Schema.MATERIAL_ITEM_LIST.key] = materialItemList;
    }

    getItemInfo() {
        return this[Schema.ITEM_INFO.key];
    }
    
    getMaterialItemList() {
        return this[Schema.MATERIAL_ITEM_LIST.key];
    }
}

module.exports = ReqItemCreate;
module.exports.Schema = Schema;