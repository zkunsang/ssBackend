const SaleEvent = require("../models/mongo/SaleEvent");
const Dao = require('./Dao');

class SaleEventDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('event');
        this.collection = this.db.collection('saleEvent');
    }

    static model = SaleEvent;

    static requireInsertFieldList() {
        return [
            SaleEvent.Schema.STORY.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            SaleEvent.Schema.STORY.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = SaleEventDao;