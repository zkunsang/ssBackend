const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    START_KEY: { key: 'startKey', required: false, type: ValidType.STRING },
    READ_TIME: { key: 'readTime', required: false, type: ValidType.NUMBER },

    READ_PAGE: { key: 'readPage', required: false, type: ValidType.NUMBER },
    RECORD: { key: 'record', required: false, type: ValidType.NUMBER },
    RECORD_CURRENT: { key: 'recordCurrent', required: false, type: ValidType.NUMBER },

    FORCE_END: { key: 'forceEnd', required: false, type: ValidType.BOOLEAN },
}

class ReqStoryEnd extends Model {
    constructor({ storyId, startKey, readTime, readPage, record, recordCurrent, forceEnd }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.START_KEY.key] = startKey;
        this[Schema.READ_TIME.key] = readTime;

        this[Schema.READ_PAGE.key] = readPage;
        this[Schema.RECORD.key] = record;
        this[Schema.RECORD_CURRENT.key] = recordCurrent;
        this[Schema.FORCE_END.key] = forceEnd;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getStartKey() {
        return this[Schema.START_KEY.key];
    }

    getReadTime() {
        return this[Schema.READ_TIME.key];
    }
}

module.exports = ReqStoryEnd;
module.exports.Schema = Schema;