const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    _ID: { key: '_id', required: false, type: ValidType.OBJECT },
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_STORY: { key: 'questStory', required: true, type: ValidType.OBJECT },
    STORY_ACTION: { key: 'storyAction', required: true, type: ValidType.OBJECT },
}

class UserQuestStory extends Model {
    constructor({ _id, uid, storyId, questStory, storyAction }) {
        super();

        this[Schema._ID.key] = _id;
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_ID.key] = storyId
        this[Schema.QUEST_STORY.key] = questStory;
        this[Schema.STORY_ACTION.key] = storyAction;
    }

    getQuestStory() {
        return this[Schema.QUEST_STORY.key];
    }

    getStoryAction() {
        return this[Schema.STORY_ACTION.key];
    }

};

module.exports = UserQuestStory;
module.exports.Schema = Schema;
