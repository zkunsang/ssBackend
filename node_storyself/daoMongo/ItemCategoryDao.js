const ItemCategory = require('../models/mongo/ItemCategory');
const Dao = require('./Dao');

class ItemCategoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('story');
        this.collection = this.db.collection('itemCategory');
    }

    static model = ItemCategory;

    static requireInsertFieldList() {
        return [
            ItemCategory.Schema.ITEM_CATEGORY.key,
            ItemCategory.Schema.CATEGORY_NAME.key,
            ItemCategory.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            ItemCategory.Schema.ITEM_CATEGORY.key
        ];
    }

    static allowSetFieldList() {
        return [
            ItemCategory.Schema.CATEGORY_NAME.key,
            ItemCategory.Schema.UPDATE_DATE.key

        ]
    };

    static notAllowSetFieldList() {
        return [
            ItemCategory.Schema.ITEM_CATEGORY.key
        ]
    };
}

module.exports = ItemCategoryDao;