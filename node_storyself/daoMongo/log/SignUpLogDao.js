const LoginLog = require("../../models/apilog/LoginLog");
const Dao = require('../Dao');

class SignUpLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection('signup');
    }

    static model = LoginLog;

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

module.exports = SignUpLogDao;