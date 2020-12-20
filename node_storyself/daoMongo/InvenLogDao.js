const InvenLog = require("../models/apilog/InvenLog");
const Dao = require('./Dao');

class InvenLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection('inven');
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