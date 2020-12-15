const Invetory = require('../models/mongo/Inventory');
const Dao = require('./Dao');

class InvetoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('user');
        this.collection = this.db.collection('inventory');
    }

    static model = Invetory;

    static requireInsertFieldList() {
        return [
            Invetory.Schema.UID.key,
            Invetory.Schema.ITEM_ID.key,
            Invetory.Schema.ITEM_QNY.key,
            Invetory.Schema.UPDATE_DATE.key,
            Invetory.Schema.CREATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Invetory.Schema.OBJECT_ID.key,
            Invetory.Schema.UID.key,
            Invetory.Schema.ITEM_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            Invetory.Schema.ITEM_QNY.key,
            Invetory.Schema.UPDATE_DATE.key,
            Invetory.Schema.CREATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            Invetory.Schema.UID.key,
            Invetory.Schema.ITEM_ID.key,
        ]
    };
}

module.exports = InvetoryDao;