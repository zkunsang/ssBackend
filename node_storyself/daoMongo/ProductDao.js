const Product = require('../models/mongo/Product');
const Dao = require('./Dao');

class ProductDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('story');
        this.collection = this.db.collection('product');
    }

    static model = Product;

    static requireInsertFieldList() {
        return [
            Product.Schema.PRODUCT_ID.key,
            Product.Schema.PRODUCT_TYPE.key,
            Product.Schema.COST_KR.key,
            Product.Schema.COST_KR_ORIGIN.key,
            Product.Schema.GOOGLE.key,
            Product.Schema.UPDATE_DATE.key,
            Product.Schema.TAG_COLOR.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Product.Schema.PRODUCT_ID.key,
            Product.Schema.GOOGLE.key,
            Product.Schema.APPLE.key,
        ];
    }

    static allowSetFieldList() {
        return [
            Product.Schema.GROUP_ID.key,
            Product.Schema.PRODUCT_TYPE.key,
            Product.Schema.COST_KR.key,
            Product.Schema.COST_KR_ORIGIN.key,
            Product.Schema.GOOGLE.key,
            Product.Schema.APPLE.key,
            Product.Schema.START_DATE.key,
            Product.Schema.END_DATE.key,
            Product.Schema.SERVER_LIMIT.key,
            Product.Schema.USER_LIMIT.key,
            Product.Schema.TAG_COLOR.key,
            Product.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            Product.Schema.PRODUCT_ID.key
        ]
    };
}

module.exports = ProductDao;