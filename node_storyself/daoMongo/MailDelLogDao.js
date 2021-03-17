const DateUtil = require('../util/DateUtil');
const MailDelLog = require("../models/apilog/MailDelLog");
const Dao = require('./Dao');

class MailDelLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`mail_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = MailDelLog;

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

module.exports = MailDelLogDao;