const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    START_KEY: { key: 'startKey', required: false, type: ValidType.STRING },
    READ_TIME: { key: 'readTime', required: false, type: ValidType.NUMBER },
}

class ReqStoryEnd extends Model {
    constructor({ storyId, startKey, readTime }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.START_KEY.key] = startKey;
        this[Schema.READ_TIME.key] = readTime;
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