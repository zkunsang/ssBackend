const ItemMaterial = require("../models/mongo/ItemMaterial");
const Dao = require('./Dao');

class ItemMaterialDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('itemExchange');
    }

    static model = ItemMaterial;

    static requireInsertFieldList() {
        return [
            ItemMaterial.Schema.ITEM_ID.key,
            ItemMaterial.Schema.MATERIAL_ID.key,
            ItemMaterial.Schema.MATERIAL_QNY.key,
            ItemMaterial.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            ItemMaterial.Schema.ITEM_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            ItemMaterial.Schema.MATERIAL_ID.key,
            ItemMaterial.Schema.MATERIAL_QNY.key,
            ItemMaterial.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            ItemMaterial.Schema.ITEM_ID.key,
        ]
    };
}

module.exports = ItemMaterialDao;