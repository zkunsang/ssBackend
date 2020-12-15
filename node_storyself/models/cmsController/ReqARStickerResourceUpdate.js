const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    INSERT_LIST: { key: 'insertList', required: true, type: ValidType.ARRAY },
    UPDATE_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
}

class ReqARStickerResourceUpdate extends Model {
    constructor({ insertList, updateList }) {
        super();
        this[Schema.INSERT_LIST.key] = insertList;
        this[Schema.UPDATE_LIST.key] = updateList;
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getInsertList() {
        return this[Schema.INSERT_LIST.key];
    }
}

module.exports = ReqARStickerResourceUpdate;
module.exports.Schema = Schema;