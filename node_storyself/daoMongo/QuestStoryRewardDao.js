const QuestStoryReward = require("../models/mongo/QuestStoryReward");
const Dao = require('./Dao');

class QuestStoryRewardDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('quest');
        this.collection = this.db.collection('queststoryreward');
    }

    static model = QuestStoryReward;

    static requireInsertFieldList() {
        return [
            QuestStoryReward.Schema.STORY_ID.key,
            QuestStoryReward.Schema.QUEST_ID.key,
            QuestStoryReward.Schema.ITEM_ID.key,
            QuestStoryReward.Schema.ITEM_QNY.key,
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

module.exports = QuestStoryRewardDao;