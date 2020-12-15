const ProductReward = require('../models/mongo/ProductReward');
const Dao = require('./Dao');

class ProductRewardDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('story');
        this.collection = this.db.collection('productReward');
    }

    static model = ProductReward;

    static requireInsertFieldList() {
        return [
            ProductReward.Schema.PRODUCT_ID.key,
            ProductReward.Schema.REWARD_TYPE.key,
            ProductReward.Schema.REWARD_ID.key,
            ProductReward.Schema.REWARD_QNY.key,
            ProductReward.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            ProductReward.Schema.PRODUCT_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            ProductReward.Schema.REWARD_TYPE.key,
            ProductReward.Schema.REWARD_ID.key,
            ProductReward.Schema.REWARD_QNY.key,
            ProductReward.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            ProductReward.Schema.PRODUCT_ID.key
        ]
    };
}

module.exports = ProductRewardDao;