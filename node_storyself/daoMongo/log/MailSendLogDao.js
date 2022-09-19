const DateUtil = require('../../util/DateUtil');
const MailSendLog = require("../../models/apilog/MailSendLog");
const Dao = require('../Dao');

class MailSendLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`mail_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = MailSendLog;

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

module.exports = MailSendLogDao;