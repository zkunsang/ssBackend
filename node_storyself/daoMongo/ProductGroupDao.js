const ProductGroup = require('../models/mongo/ProductGroup');
const Dao = require('./Dao');

class ProductGroupDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('story');
        this.collection = this.db.collection('productGroup');
    }

    static model = ProductGroup;

    static requireInsertFieldList() {
        return [
            ProductGroup.Schema.GROUP_ID.key,
            ProductGroup.Schema.START_DATE.key,
            ProductGroup.Schema.END_DATE.key,
            ProductGroup.Schema.SERVER_LIMIT.key,
            ProductGroup.Schema.USER_LIMIT.key,
            ProductGroup.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            ProductGroup.Schema.GROUP_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            ProductGroup.Schema.START_DATE.key,
            ProductGroup.Schema.END_DATE.key,
            ProductGroup.Schema.SERVER_LIMIT.key,
            ProductGroup.Schema.USER_LIMIT.key,
            ProductGroup.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            ProductGroup.Schema.GROUP_ID.key,
        ]
    };
}

module.exports = ProductGroupDao;