const DateUtil = require('../util/DateUtil');
const PreviewLog = require('../models/apilog/PreviewLog');
const Dao = require('./Dao');

class PreviewLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`preview_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = PreviewLog;

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

module.exports = PreviewLogDao;