const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    INSERT_LIST: { key: 'insertList', required: true, type: ValidType.ARRAY },
    UPDATE_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
    BEFORE_INVEN_MAP: { key: 'beforeInvenMap', required: true, type: ValidType.OBJECT },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADD_INFO: { key: 'addInfo', required: false, type: ValidType.OBJECT },
}

class InventoryPutObject extends Model {
    constructor({ insertList, updateList, beforeInvenMap, action, addInfo }) {
        super();
        this[Schema.UPDATE_LIST.key] = updateList;
        this[Schema.INSERT_LIST.key] = insertList;
        this[Schema.BEFORE_INVEN_MAP.key] = beforeInvenMap;
        this[Schema.ACTION.key] = action;
        this[Schema.ADD_INFO.key] = addInfo;
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getInsertList() {
        return this[Schema.INSERT_LIST.key];
    }

    getBeforeInvenMap() {
        return this[Schema.BEFORE_INVEN_MAP.key];
    }    

    getAction() {
        return this[Schema.ACTION.key];
    }

    getAddInfo() {
        return this[Schema.ADD_INFO.key];
    }
}

module.exports = InventoryPutObject;
module.exports.Schema = Schema;