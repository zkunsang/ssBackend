const Item = require("../models/mongo/Item");
const Dao = require('./Dao');

class ItemDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('item');
    }

    static model = Item;

    static requireInsertFieldList() {
        return [
            Item.Schema.ITEM_ID.key,
            Item.Schema.ITEM_CATEGORY.key,
            Item.Schema.GROUP_ID.key,
            Item.Schema.USEABLE.key,
            Item.Schema.OVERLAP.key,
            Item.Schema.MAX_QNY.key,
            Item.Schema.VOLATILE_SECONDS.key,
            Item.Schema.PRIORITY.key,
            Item.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Item.Schema.ITEM_ID.key,
            Item.Schema.ITEM_CATEGORY.key,
        ];
    }

    static allowSetFieldList() {
        return [
            Item.Schema.ITEM_CATEGORY.key,
            Item.Schema.GROUP_ID.key,
            Item.Schema.USEABLE.key,
            Item.Schema.OVERLAP.key,
            Item.Schema.MAX_QNY.key,
            Item.Schema.VOLATILE_SECONDS.key,
            Item.Schema.PRIORITY.key,
            Item.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            Item.Schema.ITEM_ID.key,
        ]
    };
}

module.exports = ItemDao;