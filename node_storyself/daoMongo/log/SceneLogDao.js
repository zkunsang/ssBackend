const DateUtil = require('../../util/DateUtil');
const SceneLog = require('../../models/apilog/SceneLog');
const Dao = require('../Dao');

class SceneLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`scene_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = SceneLog;

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

module.exports = SceneLogDao;