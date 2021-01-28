const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const QuestActionType = ValidateUtil.QuestActionType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: true, type: ValidType.NUMBER },
    COUNT: { key: 'count', required: true, type: ValidType.NUMBER },
    ACTION_TYPE: { key: 'actionType', required: true, type: ValidType.NUMBER, validRange: Object.values(QuestActionType) },
    ACTION_ID: { key: 'actionId', required: true, type: ValidType.NUMBER }
}

class QuestRewardGoal extends Model {
    constructor({ storyId, questId, actionType, count, actionId }) {
        super();
        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.QUEST_ID.key] = ValidateUtil.setNullUndefined(questId);
        this[Schema.ACTION_TYPE.key] = ValidateUtil.setNullUndefined(actionType);
        this[Schema.COUNT.key] = ValidateUtil.setNullUndefined(count);
        this[Schema.ACTION_ID.key] = ValidateUtil.setNullUndefined(actionId);
    }
}

module.exports = QuestRewardGoal;
module.exports.Schema = Schema;