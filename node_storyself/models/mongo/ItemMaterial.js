const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const Inventory = require('../../models/mongo/Inventory');

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    MATERIAL_ID: { key: 'materialId', required: true, type: ValidType.STRING },
    MATERIAL_QNY: { key: 'materialQny', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ItemMaterial extends Model {
    constructor({ itemId, materialId, materialQny }) {
        super();
        this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
        this[Schema.MATERIAL_ID.key] = ValidateUtil.setNullUndefined(materialId);
        this[Schema.MATERIAL_QNY.key] = ValidateUtil.setNullUndefined(materialQny);
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    makeInventoryObject() {
        let inventoryObj = {}
        inventoryObj[Inventory.Schema.ITEM_ID.key] = this[Schema.MATERIAL_ID.key];
        inventoryObj[Inventory.Schema.ITEM_QNY.key] = this[Schema.MATERIAL_QNY.key];

        return new Inventory(inventoryObj);
    }

    static makeInvetoryObjectList(materialList) {
        return materialList.map((item) => item.makeInventoryObject());
    }
}

module.exports = ItemMaterial;
module.exports.Schema = Schema;