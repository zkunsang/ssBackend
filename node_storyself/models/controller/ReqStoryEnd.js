const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    START_KEY: { key: 'startKey', required: true, type: ValidType.STRING },
}

class ReqStoryEnd extends Model {
    constructor({ storyId, startKey }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.START_KEY.key] = startKey;

    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getStartKey() {
        return this[Schema.START_KEY.key];
    }
}

module.exports = ReqStoryEnd;
module.exports.Schema = Schema;