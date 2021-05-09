const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Inventory = require('../../models/mongo/Inventory');

const Schema = {
    USE_ITEM: { key: 'useItem', required: false, type: ValidType.ARRAY },
    PUT_ITEM: { key: 'putItem', required: false, type: ValidType.ARRAY },
    ACTION: { key: 'action', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class HoneyHistory extends Model {
    constructor({ useItem, putItem, action, updateDate }) {
        super();

        this[Schema.USE_ITEM.key] = useItem ? useItem.map(item => new Inventory(item)) : undefined;
        this[Schema.PUT_ITEM.key] = putItem ? putItem.map(item => new Inventory(item)) : undefined;

        this[Schema.ACTION.key] = action;
        this[Schema.UPDATE_DATE.key] = updateDate;
    }
}

module.exports = HoneyHistory;
module.exports.Schema = Schema;
