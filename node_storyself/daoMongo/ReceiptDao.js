const Receipt = require("../models/mongo/Receipt");
const Dao = require('./Dao');

class ReceiptDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('user');
        this.collection = this.db.collection('receipt');
    }

    static model = Receipt;

    static requireInsertFieldList() {
        return [
            Receipt.Schema.UID.key,
            Receipt.Schema.APPSTORE.key,
            Receipt.Schema.TRANSACTION_ID.key,
            Receipt.Schema.PRODUCT_ID.key,
            Receipt.Schema.PURCHASE_DATE.key,
            Receipt.Schema.PURCHASE_STATE.key,
            Receipt.Schema.PURCHASE_TOKEN.key,
            Receipt.Schema.PACKAGE_NAME.key,
            Receipt.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Receipt.Schema.UID.key,
            Receipt.Schema.TRANSACTION_ID.key,
            Receipt.Schema.PRODUCT_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [];
    };

    static notAllowSetFieldList() {
        return [];
    };
}

module.exports = ReceiptDao;