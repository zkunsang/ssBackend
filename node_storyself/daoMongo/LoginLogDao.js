const DateUtil = require('../util/DateUtil');
const LoginLog = require('../models/apilog/LoginLog');
const Dao = require('./Dao');

class LoginLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`login_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = LoginLog;

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

module.exports = LoginLogDao;