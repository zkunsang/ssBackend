const Model = require('../../models')

const ValidateUtil = require('@ss/util/ValidateUtil');

const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_STORY: { key: 'questStory', required: true, type: ValidType.ARRAY },
    QUEST_STORY_GOAL: { key: 'questStoryGoal', required: true, type: ValidType.ARRAY },
    QUEST_STORY_REWARD: { key: 'questStoryReward', required: true, type: ValidType.ARRAY }
}

class ReqQuestStoryUpdateMany extends Model {
    constructor({ storyId, questStory, questStoryGoal, questStoryReward }) {
        super();
        this[Schema.STORY_ID.key] = storyId;

        this[Schema.QUEST_STORY.key] = questStory;
        this[Schema.QUEST_STORY_GOAL.key] = questStoryGoal;
        this[Schema.QUEST_STORY_REWARD.key] = questStoryReward;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getQuestStoryList() {
        return this[Schema.QUEST_STORY.key];
    }

    getQuestStoryGoalList() {
        return this[Schema.QUEST_STORY_GOAL.key];
    }

    getQuestStoryRewardList() {
        return this[Schema.QUEST_STORY_REWARD.key];
    }
}

module.exports = ReqQuestStoryUpdateMany;
module.exports.Schema = Schema;

