const ARStickerResource = require("../models/mongo/ARStickerResource");
const Dao = require('./Dao');

class ARStickerResourceDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('arsticker');
    }

    static model = ARStickerResource;

    static requireInsertFieldList() {
        return [
            ARStickerResource.Schema.RESOURCE_ID.key,
            ARStickerResource.Schema.VERSION.key,
            ARStickerResource.Schema.CRC32.key,
            ARStickerResource.Schema.SIZE.key,
            ARStickerResource.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            ARStickerResource.Schema.VERSION.key,
            ARStickerResource.Schema.CRC32.key,
            ARStickerResource.Schema.SIZE.key,
            ARStickerResource.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = ARStickerResourceDao;