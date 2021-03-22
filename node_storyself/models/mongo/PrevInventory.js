const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
    UID: { key: 'uid', required: true, type: ValidType.STRING },
}

class PrevInventory extends Model {
    constructor({ uid, itemId, itemQny }) {
        super();
            
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
        this[Schema.ITEM_QNY.key] = ValidateUtil.setNullUndefined(itemQny);
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }

    getItemQny() {
        return this[Schema.ITEM_QNY.key];
    }

    /**
     * 
     * @param {*} inventoryPut 
     */
    addItem(inventoryPut) {
        this[Schema.ITEM_QNY.key] += inventoryPut.getItemQny();
    }

    /**
     * 
     * @param {InventoryUse} inventoryUse
     */

    minusItem(inventoryUse) {
        this[Schema.ITEM_QNY.key] -= inventoryUse.getItemQny();
    }

    
}

module.exports = PrevInventory;
module.exports.Schema = Schema;
