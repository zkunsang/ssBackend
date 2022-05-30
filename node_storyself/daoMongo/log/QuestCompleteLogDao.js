const DateUtil = require("@ss/util/DateUtil");
const QuestCompleteLog = require("../../models/apilog/QuestCompleteLog");
const Dao = require('../Dao');

class QuestCompleteLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`questComplete_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = QuestCompleteLog;

    static requireInsertFieldList() {
        return [
            QuestCompleteLog.Schema.UID.key,
            QuestCompleteLog.Schema.STORY_ID.key,
            QuestCompleteLog.Schema.QUEST_ID.key,
            QuestCompleteLog.Schema.COMPLETE_TYPE.key,
            QuestCompleteLog.Schema.ACCEPT_DATE.key,
            QuestCompleteLog.Schema.LOG_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            QuestCompleteLog.Schema.UID.key,
            QuestCompleteLog.Schema.STORY_ID.key,
            QuestCompleteLog.Schema.QUEST_ID.key,
            QuestCompleteLog.Schema.COMPLETE_TYPE.key,
            QuestCompleteLog.Schema.ACCEPT_DATE.key,
            QuestCompleteLog.Schema.LOG_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = QuestCompleteLogDao;