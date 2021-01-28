const QuestStory = require("../models/mongo/QuestStory");
const Dao = require('./Dao');

class QuestStoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('quest');
        this.collection = this.db.collection('queststory');
    }

    static model = QuestStory;

    static requireInsertFieldList() {
        return [
            QuestStory.Schema.STORY_ID.key,
            QuestStory.Schema.QUEST_ID.key,
            QuestStory.Schema.QUEST_STATUS.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [];
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = QuestStoryDao;