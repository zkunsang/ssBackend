const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    OBJECT_ID: { key: '_id', required: false, type: ValidType.OBJECT },
}

class Inventory extends Model {
    constructor({ uid, itemId, itemQny, updateDate, createDate, endDate, _id }) {
        super();
            
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
        this[Schema.ITEM_QNY.key] = ValidateUtil.setNullUndefined(itemQny);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
        this[Schema.CREATE_DATE.key] = ValidateUtil.setNullUndefined(createDate);
        this[Schema.END_DATE.key] = ValidateUtil.setNullUndefined(endDate);
        this[Schema.OBJECT_ID.key] = ValidateUtil.setNullUndefined(_id);
    }

    setUID(uid) {
        this[Schema.UID.key] = uid;
    }

    setEndDate(endDate) {
        this[Schema.END_DATE.key] = endDate;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    setCreateDate(createDate) {
        this[Schema.CREATE_DATE.key] = createDate;
    }

    setItemQny(itemQny) {
        this[Schema.ITEM_QNY.key] = itemQny;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }

    getItemQny() {
        return this[Schema.ITEM_QNY.key];
    }

    getCreateDate() {
        return this[Schema.CREATE_DATE.key];
    }

    getEndDate() {
        return this[Schema.END_DATE.key];
    }

    getObjectId() {
        return this[Schema.OBJECT_ID.key];
    }

    addItem(inventory) {
        this[Schema.ITEM_QNY.key] += inventory.getItemQny();
        this.setUpdateDate(inventory.getUpdateDate());
    }

    minusItem(inventory) {
        this[Schema.ITEM_QNY.key] -= inventory.getItemQny();
        this.setUpdateDate(inventory.getUpdateDate());
    }

    
}

module.exports = Inventory;
module.exports.Schema = Schema;
