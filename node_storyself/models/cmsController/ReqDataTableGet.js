const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    TABLE_ID: { key: 'tableId', required: true, type: ValidType.STRING, },
}

class ReqDataTableGet extends Model {
    constructor({ tableId }) {
        super();
        this[Schema.TABLE_ID.key] = tableId;
    }

    getTableId() {
        return this[Schema.TABLE_ID.key];
    }
}

module.exports = ReqDataTableGet;
module.exports.Schema = Schema;