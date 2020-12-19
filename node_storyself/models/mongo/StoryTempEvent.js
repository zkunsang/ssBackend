const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class StoryTempEvent extends Model {
    constructor({ uid, storyId, updateDate }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }
}

module.exports = StoryTempEvent;
module.exports.Schema = Schema;