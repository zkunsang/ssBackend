const ActionLog = require("../models/apilog/ActionLog");
const Dao = require('./Dao');

class ActionLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection('action');
    }

    static model = ActionLog;

    static requireInsertFieldList() {
        return [
            ActionLog.Schema.UID.key,
            ActionLog.Schema.ACTION_DATE.key,
            ActionLog.Schema.ACTION_TYPE.key,
            ActionLog.Schema.ACTION_ID.key,
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

module.exports = ActionLogDao;