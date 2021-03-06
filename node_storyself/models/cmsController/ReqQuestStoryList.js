const Model = require('../../models')

const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING }
}

class ReqQuestStoryUpdateMany extends Model {
    constructor({ storyId }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqQuestStoryUpdateMany;
module.exports.Schema = Schema;