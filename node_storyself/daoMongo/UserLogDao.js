const DateUtil = require('../util/DateUtil');
const UserLog = require('../models/apilog/UserLog');
const Dao = require('./Dao');

class UserLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection(`user_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = UserLog;

    static requireInsertFieldList() {
        return [];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return []
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = UserLogDao;