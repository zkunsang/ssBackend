const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: true, type: ValidType.STRING },
}

class ReqQuestAccept extends Model {
    constructor({ storyId, questId }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.QUEST_ID.key] = questId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getQuestId() {
        return this[Schema.QUEST_ID.key];
    }
}

module.exports = ReqQuestAccept;
module.exports.Schema = Schema;