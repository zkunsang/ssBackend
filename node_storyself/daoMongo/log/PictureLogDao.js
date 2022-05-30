const DateUtil = require('../../util/DateUtil');
const PictureLog = require('../../models/apilog/PictureLog');
const Dao = require('../Dao');

class PictureLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`picture_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = PictureLog;

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

module.exports = PictureLogDao;