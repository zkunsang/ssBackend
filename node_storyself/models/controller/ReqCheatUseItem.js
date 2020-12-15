const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const InventoryDao = require('../../daoMongo/InventoryDao');

const Schema = {
    USE_LIST: { key: 'useList', required: true, type: ValidType.ARRAY },
}

class ReqCheatUseItem extends Model {
    constructor({ useList }) {
        super();
        this[Schema.USE_LIST.key] = useList;
    }

    getInventoryList() {
        return InventoryDao.mappingList(this[Schema.USE_LIST.key]);
    }
}

module.exports = ReqCheatUseItem;
module.exports.Schema = Schema;