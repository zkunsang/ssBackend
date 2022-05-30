const DateUtil = require("@ss/util/DateUtil");
const NetworkLog = require("../../models/apilog/NetworkLog");
const Dao = require('../Dao');

class NetworkLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`network_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
    }

    static model = NetworkLog;

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

module.exports = NetworkLogDao;