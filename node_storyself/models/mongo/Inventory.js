const { isNumber } = require('lodash');
const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
}

class Inventory extends Model {
    constructor({ itemId, itemQny }) {
        super();

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
        if (isNumber(this[Schema.ITEM_QNY.key])) this[Schema.ITEM_QNY.key] += inventoryPut.getItemQny();
        else this[Schema.ITEM_QNY.key] = inventoryPut.getItemQny();
    }

    /**
     * 
     * @param {InventoryUse} inventoryUse
     */

    minusItem(inventoryUse) {
        if (isNumber(this[Schema.ITEM_QNY.key])) this[Schema.ITEM_QNY.key] -= inventoryUse.getItemQny();
        else this[Schema.ITEM_QNY.key] = inventoryPut.getItemQny() * -1;

    }


}

module.exports = Inventory;
module.exports.Schema = Schema;
