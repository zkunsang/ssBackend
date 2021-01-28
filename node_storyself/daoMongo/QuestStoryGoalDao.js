const QuestStoryGoal = require("../models/mongo/QuestStoryGoal");
const Dao = require('./Dao');

class QuestStoryGoalDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('quest');
        this.collection = this.db.collection('queststorygoal');
    }

    static model = QuestStoryGoal;

    static requireInsertFieldList() {
        return [
            QuestStoryGoal.Schema.STORY_ID.key,
            QuestStoryGoal.Schema.QUEST_ID.key,
            QuestStoryGoal.Schema.ACTION_TYPE.key,
            QuestStoryGoal.Schema.COUNT.key,
            QuestStoryGoal.Schema.ACTION_ID.key,
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

module.exports = QuestStoryGoalDao;