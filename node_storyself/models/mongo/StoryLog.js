const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const StoryLogType = {
    START: 1,
    END: 2
}

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    START_KEY: { key: 'startKey', required: true, type: ValidType.STRING },
    TYPE: { key: 'type', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class StoryLog extends Model {
    constructor({ uid, storyId, type, updateDate, startKey }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.START_KEY.key] = ValidateUtil.setNullUndefined(startKey);
        this[Schema.TYPE.key] = ValidateUtil.setNullUndefined(type);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);

    }
}

module.exports = StoryLog;
module.exports.Schema = Schema;
module.exports.StoryLogType = StoryLogType;