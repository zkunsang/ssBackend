const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const TableIdList = {
    ITEM: 'item',
    ITEM_EXCHANGE: 'itemExchange',
    ITEM_CATEGORY: 'itemCategory',
    
    PRODUCT: 'product',
    PRODUCT_GROUP: 'productGroup',
    PRODUCT_REWARD: 'productReward',

    STORY: 'story',
    RESOURCE: 'resource',
}

const Schema = {
    TABLE_ID: { key: 'tableId', required: true, type: ValidType.STRING },
    VERSION: { key: 'version', required: true, type: ValidType.STRING },
    CRC32: { key: 'crc32', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class DataTable extends Model {
    constructor({ tableId, version, crc32, updateDate }) {
        super();

        this[Schema.TABLE_ID.key] = ValidateUtil.setNullUndefined(tableId);
        this[Schema.VERSION.key] = ValidateUtil.setNullUndefined(version);
        this[Schema.CRC32.key] = ValidateUtil.setNullUndefined(crc32);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }
}

module.exports = DataTable;
module.exports.Schema = Schema;
module.exports.TableIdList = TableIdList;