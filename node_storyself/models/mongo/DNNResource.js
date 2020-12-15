const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    RESOURCE_ID: { key: 'resourceId', required: true, type: ValidType.STRING },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER },
    SIZE: { key: 'size', required: true, type: ValidType.NUMBER },
    CRC32: { key: 'crc32', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class DNNResource extends Model {
    constructor({ resourceId, version, size, crc32, updateDate }) {
        super();

        this[Schema.RESOURCE_ID.key] = ValidateUtil.setNullUndefined(resourceId);
        this[Schema.VERSION.key] = ValidateUtil.setNullUndefined(version);
        this[Schema.SIZE.key] = ValidateUtil.setNullUndefined(size);
        this[Schema.CRC32.key] = ValidateUtil.setNullUndefined(crc32);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getResourceId() {
        return this[Schema.RESOURCE_ID.key];
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }
}

module.exports = DNNResource;
module.exports.Schema = Schema;