const IP = require('../models/mongo/IP');
const Dao = require('./Dao');

class IPDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('ums');
        this.collection = this.db.collection('ip');
    }

    static model = IP;

    static requireInsertFieldList() {
        return [
            IP.Schema.IP.key,
            IP.Schema.UPDATE_DATE.key,
            IP.Schema.ADMIN_ID.key,
            IP.Schema.MEMO.key,
            IP.Schema.TYPE.key,
            IP.Schema.STATUS.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            IP.Schema.IP.key,
            IP.Schema.TYPE.key,
            IP.Schema.STATUS.key,
        ];
    }

    static allowSetFieldList() {
        return [
            IP.Schema.STATUS.key,
            IP.Schema.UPDATE_DATE.key,
            IP.Schema.MEMO.key,
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = IPDao;