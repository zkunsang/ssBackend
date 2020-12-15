const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    TABLE_ID: { key: 'tableId', required: true, type: ValidType.STRING, },
    VERSION: { key: 'version', required: true, type: ValidType.STRING },
    CRC32: { key: 'crc32', required: true, type: ValidType.STRING },
}

class ReqDataTableUpdate extends Model {
    constructor({ tableId, version, crc32 }) {
        super();
        this[Schema.TABLE_ID.key] = tableId;
        this[Schema.VERSION.key] = version;
        this[Schema.CRC32.key] = crc32;
    }

    getTableId() {
        return this[Schema.TABLE_ID.key];
    }

    getVersion() {
        return this[Schema.VERSION.key];   
    }

    getCRC32() {
        return this[Schema.CRC32.key];   
    }
}

module.exports = ReqDataTableUpdate;
module.exports.Schema = Schema;