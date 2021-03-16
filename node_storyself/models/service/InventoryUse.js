const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
    ADD_INFO: { key: 'addInfo', required: false, type: ValidType.OBJECT }
}

class InventoryUse extends Model {
    constructor({ itemId, itemQny, action, addInfo }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_QNY.key] = itemQny;
        
        this[Schema.ACTION.key] = action;
        this[Schema.ADD_INFO.key] = addInfo;
    }

    addQny(itemQny) {
        this[Schema.ITEM_QNY.key] += itemQny;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }

    getItemQny() {
        return this[Schema.ITEM_QNY.key];
    }

    getAddInfo() {
        return this[Schema.ADD_INFO.key];
    }

    getAction() {
        return this[Schema.ACTION.key];
    }
}

module.exports = InventoryUse;
module.exports.Schema = Schema;