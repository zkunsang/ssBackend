const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    BEFORE: { key: 'before', required: false, type: ValidType.ARRAY },
    AFTER: { key: 'after', required: false, type: ValidType.ARRAY },
}

class PreviewLog extends Model {
    constructor({ uid, storyId, before, after }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.BEFORE.key] = before;
        this[Schema.AFTER.key] = after;

        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = PreviewLog;
module.exports.Schema = Schema;