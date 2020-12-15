const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');

const ItemCache = require('../../dbCache/ItemCache');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    BEFORE_INVEN: { key: 'beforeInven', required: true, type: ValidType.OBJECT },
    AFTER_INVEN: { key: 'afterInven', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADMIN_INFO: { key: 'adminInfo', required: false, type: ValidType.OBJECT }
}

class InventoryChangeUpdate extends Model {
    constructor({ beforeInven, afterInven, action, adminInfo }) {
        super();
        this[Schema.BEFORE_INVEN.key] = beforeInven;
        this[Schema.AFTER_INVEN.key] = afterInven;
        this[Schema.ACTION.key] = action;
        this[Schema.ADMIN_INFO.key] = adminInfo;
    }

    getInvenLog(uid, logDate) {
        const beforeInven = this[Schema.BEFORE_INVEN.key];
        const afterInven = this[Schema.AFTER_INVEN.key];
        const action = this[Schema.ACTION.key];

        const itemId = beforeInven.getItemId();
        
        if (itemId !== afterInven.getItemId()) {
            console.error('itemId wrong');
            return;
        }

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = beforeInven.getItemQny();
        const afterQny = afterInven.getItemQny();
        const diffQny = afterQny - beforeQny;

        const invenLog = { uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate, action };
        if(this.adminInfo) {
            const { adminId, editKey } = this.adminInfo;
            invenLog.adminId = adminId;
            invenLog.editKey = editKey;
        }
        
        return new InvenLog(invenLog);
    }
}

module.exports = InventoryChangeUpdate;
module.exports.Schema = Schema;