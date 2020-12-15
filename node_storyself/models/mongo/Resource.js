const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    RESOURCE_ID: { key: 'resourceId', required: true, type: ValidType.STRING },
    SIZE: { key: 'size', required: true, type: ValidType.NUMBER },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER },
    CRC32: { key: 'crc32', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Resource extends Model {
    constructor({ storyId, resourceId, size, version, crc32, updateDate }) {
        super();

        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.RESOURCE_ID.key] = ValidateUtil.setNullUndefined(resourceId);
        this[Schema.SIZE.key] = ValidateUtil.setNullUndefined(size);
        this[Schema.VERSION.key] = ValidateUtil.setNullUndefined(version);
        this[Schema.CRC32.key] = ValidateUtil.setNullUndefined(crc32);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getResourceId() {
        return this[Schema.RESOURCE_ID.key];
    }
}

module.exports = Resource;
module.exports.Schema = Schema;