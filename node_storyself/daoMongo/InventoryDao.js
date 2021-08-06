const PrevInventory = require('../models/mongo/PrevInventory');
const Dao = require('./Dao');

class InvetoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('user');
        this.collection = this.db.collection('inventory');
    }

    static model = PrevInventory;

    static requireInsertFieldList() {
        return [
            PrevInventory.Schema.ITEM_ID.key,
            PrevInventory.Schema.ITEM_QNY.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            PrevInventory.Schema.ITEM_ID.key,
            PrevInventory.Schema.UID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            PrevInventory.Schema.ITEM_QNY.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            PrevInventory.Schema.ITEM_ID.key,
        ]
    };
}

module.exports = InvetoryDao;