const ProductLog = require("../models/apilog/ProductLog");
const Dao = require('./Dao');

class ProductLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection('product');
    }

    static model = ProductLog;

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

module.exports = ProductLogDao;