const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');
const ItemCache = require('../../dbCache/ItemCache')


const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    INSERT_INVEN: { key: 'insertInven', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADMIN_INFO: { key: 'adminInfo', required: false, type: ValidType.OBJECT }
}

class InventoryChangeInsert extends Model {
    constructor({ insertInven, action, adminInfo }) {
        super();
        this[Schema.INSERT_INVEN.key] = insertInven;
        this[Schema.ACTION.key] = action;
        this[Schema.ADMIN_INFO.key] = adminInfo;
    }

    getInvenLog(uid, logDate) {
        const insertInven = this[Schema.INSERT_INVEN.key];
        const action = this[Schema.ACTION.key];

        const itemId = insertInven.getItemId();

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = 0;
        const afterQny = insertInven.getItemQny();
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

module.exports = InventoryChangeInsert;
module.exports.Schema = Schema;