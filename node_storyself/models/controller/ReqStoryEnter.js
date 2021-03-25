const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING }
}

class ReqStoryEnter extends Model {
    constructor({ storyId }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqStoryEnter;
module.exports.Schema = Schema;