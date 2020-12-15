const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    DELETE_LIST: { key: 'deleteList', required: true, type: ValidType.ARRAY },
    UPDATE_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
    BEFORE_INVEN_MAP: { key: 'beforeInvenMap', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADMIN_INFO: { key: 'adminInfo', required: false, type: ValidType.OBJECT }
}

class InventoryUseObject extends Model {
    constructor({ updateList, deleteList, beforeInvenMap, action, adminInfo }) {
        super();
        this[Schema.UPDATE_LIST.key] = updateList;
        this[Schema.DELETE_LIST.key] = deleteList;
        this[Schema.BEFORE_INVEN_MAP.key] = beforeInvenMap;
        this[Schema.ACTION.key] = action;
        this[Schema.ADMIN_INFO.key] = adminInfo;
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getDeleteList() {
        return this[Schema.DELETE_LIST.key];
    }

    getBeforeInvenMap() {
        return this[Schema.BEFORE_INVEN_MAP.key];
    }

    getAction() {
        return this[Schema.ACTION.key];
    }

    getAdminInfo() {
        return this[Schema.ADMIN_INFO.key];
    }
}

module.exports = InventoryUseObject;
module.exports.Schema = Schema;