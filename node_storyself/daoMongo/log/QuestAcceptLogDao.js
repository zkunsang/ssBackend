const DateUtil = require("@ss/util/DateUtil");
const QuestAcceptLog = require("../../models/apilog/QuestAcceptLog");
const Dao = require('../Dao');

class QuestAcceptLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`questAccept_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = QuestAcceptLog;

    static requireInsertFieldList() {
        return [
            QuestAcceptLog.Schema.UID.key,
            QuestAcceptLog.Schema.STORY_ID.key,
            QuestAcceptLog.Schema.QUEST_ID.key,
            QuestAcceptLog.Schema.LOG_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            QuestAcceptLog.Schema.UID.key,
            QuestAcceptLog.Schema.STORY_ID.key,
            QuestAcceptLog.Schema.QUEST_ID.key,
            QuestAcceptLog.Schema.LOG_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = QuestAcceptLogDao;