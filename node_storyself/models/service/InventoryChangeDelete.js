const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');
const ItemCache = require('../../dbCache/ItemCache');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    BEFORE_INVEN: { key: 'beforeInven', required: true, type: ValidType.OBJECT },
    DELETE_INVEN: { key: 'deleteInven', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADD_INFO: { key: 'addInfo', required: false, type: ValidType.OBJECT }
}

class InventoryChangeDelete extends Model {
    constructor({ beforeInven, deleteInven, action }, addInfo) {
        super();
        
        this[Schema.BEFORE_INVEN.key] = beforeInven;
        this[Schema.DELETE_INVEN.key] = deleteInven;
        this[Schema.ACTION.key] = action;
        this[Schema.ADD_INFO.key] = addInfo;
    }

    getInvenLog(uid, logDate) {
        const beforeInven = this[Schema.BEFORE_INVEN.key];
        const deleteInven = this[Schema.DELETE_INVEN.key];
        const action = this[Schema.ACTION.key];

        const itemId = deleteInven.getItemId();

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = beforeInven.getItemQny();
        const afterQny = 0;
        const diffQny = afterQny - beforeQny;

        const invenLog = { uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate, action };

        InvenLog.parseAddInfo(invenLog, this.addInfo); 

        return new InvenLog(invenLog);
    }
}

module.exports = InventoryChangeDelete;
module.exports.Schema = Schema;