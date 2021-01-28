const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING},
    QUEST_ID: { key: 'questId', required: true, type: ValidType.NUMBER },
    QUEST_STATUS: { key: 'questStatus', required: true, type: ValidType.NUMBER },
}

class QuestStory extends Model {
    constructor({ storyId, questId, questStatus }) {
        super();
        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.QUEST_ID.key] = ValidateUtil.setNullUndefined(questId);
        this[Schema.QUEST_STATUS.key] = ValidateUtil.setNullUndefined(questStatus);
    }
}

module.exports = QuestStory;
module.exports.Schema = Schema;
