const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    _ID: { key: '_id', required: false, type: ValidType.OBJECT },
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_CLEAR: { key: 'questClear', required: false, type: ValidType.OBJECT },
    QUEST_ACCEPT: { key: 'questAccept', required: false, type: ValidType.OBJECT },
    QUEST_ACTION: { key: 'storyAction', required: false, type: ValidType.OBJECT },
}

class UserQuestStory extends Model {
    constructor({ _id, uid, storyId, questClear, questAccept, storyAction }) {
        super();

        this[Schema._ID.key] = _id;
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.QUEST_CLEAR.key] = questClear;
        this[Schema.QUEST_ACCEPT.key] = questAccept;
        this[Schema.QUEST_ACTION.key] = storyAction;
    }

    getStoryAction() {
        return this[Schema.QUEST_ACTION.key] || {};
    }

    getQuestClear() {
        return this[Schema.QUEST_CLEAR.key] || {};
    }

    getQuestAccept() {
        return this[Schema.QUEST_ACCEPT.key] || {};
    }

    getObjectId() {
        return this[Schema._ID.key];
    }
};

module.exports = UserQuestStory;
module.exports.Schema = Schema;
