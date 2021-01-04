const DateUtil = require('../util/DateUtil');
const InvenLog = require('../models/apilog/InvenLog');
const Dao = require('./Dao');

class InvenLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection(`inven_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = InvenLog;

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

module.exports = InvenLogDao;