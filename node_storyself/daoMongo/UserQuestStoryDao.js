const UserQuestStory = require('../models/mongo/UserQuestStory');
const Dao = require('./Dao');

class UserQuestStoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('user');
        this.collection = this.db.collection('queststory');
    }

    static model = UserQuestStory;

    static requireInsertFieldList() {
        return [
            UserQuestStory.Schema.UID.key,
            UserQuestStory.Schema.STORY_ID.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            UserQuestStory.Schema._ID.key,
            UserQuestStory.Schema.UID.key,
            UserQuestStory.Schema.STORY_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            UserQuestStory.Schema.STORY_ACTION.key,
            UserQuestStory.Schema.QUEST_STORY.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = UserQuestStoryDao;