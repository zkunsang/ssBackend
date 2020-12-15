const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');
const ItemCache = require('../../dbCache/ItemCache');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    DELETE_INVEN: { key: 'deleteInven', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADMIN_INFO: { key: 'adminInfo', required: false, type: ValidType.OBJECT }
}

class InventoryChangeDelete extends Model {
    constructor({ deleteInven, action, adminInfo }) {
        super();
        this[Schema.DELETE_INVEN.key] = deleteInven;
        this[Schema.ACTION.key] = action;
        this[Schema.ADMIN_INFO.key] = adminInfo;
    }

    getInvenLog(uid, logDate) {
        const deleteInven = this[Schema.DELETE_INVEN.key];
        const action = this[Schema.ACTION.key];

        const itemId = deleteInven.getItemId();

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = deleteInven.getItemQny();
        const afterQny = 0;
        const diffQny = afterQny - beforeQny;

        const invenLog = { uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate, action };

        if(this.adminInfo) {
            const { adminId, editKey } = this.adminInfo;
            invenLog.adminInfo = adminId;
            invenLog.editKey = editKey;
        }

        return new InvenLog(invenLog);
    }
}

module.exports = InventoryChangeDelete;
module.exports.Schema = Schema;