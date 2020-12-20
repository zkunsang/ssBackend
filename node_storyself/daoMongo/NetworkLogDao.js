const NetworkLog = require("../models/apilog/NetworkLog");
const Dao = require('./Dao');

class NetworkLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection('network');
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