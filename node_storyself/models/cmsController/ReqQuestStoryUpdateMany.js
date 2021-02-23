const Model = require('../../models')

const ValidateUtil = require('@ss/util/ValidateUtil');

const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: true, type: ValidType.ARRAY },
    QUEST_GOAL: { key: 'questGoal', required: true, type: ValidType.ARRAY },
    QUEST_REWARD: { key: 'questRewared', required: true, type: ValidType.ARRAY }
}

class ReqQuestStoryUpdateMany extends Model {
    constructor({ storyId, questId, questGoal, questReward }) {
        super();
        this[Schema.STORY_ID.key] = storyId;

        this[Schema.QUEST_ID.key] = questId;
        this[Schema.QUEST_GOAL.key] = questGoal;
        this[Schema.QUEST_REWARD.key] = questReward;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getQuestIdList() {
        return this[Schema.QUEST_ID.key];
    }

    getGoalList() {
        return this[Schema.QUEST_GOAL.key];
    }

    getRewardList() {
        return this[Schema.QUEST_REWARD.key];
    }
}

module.exports = ReqQuestStoryUpdateMany;
module.exports.Schema = Schema;

