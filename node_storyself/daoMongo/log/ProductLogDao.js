const DateUtil = require('@ss/util/DateUtil');
const ProductLog = require("../../models/apilog/ProductLog");
const Dao = require('../Dao');

class ProductLogDao extends Dao {
    constructor(connection, date) {
        super();
        this.db = connection.logConnect.db('log');
        this.collection = this.db.collection(`product_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`);
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