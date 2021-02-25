const DateUtil = require('../util/DateUtil');
const VoiceLog = require('../models/apilog/VoiceLog');
const Dao = require('./Dao');

class VoiceLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection(`voice_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = VoiceLog;

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

module.exports = VoiceLogDao;