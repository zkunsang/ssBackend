const CommonResource = require("../models/mongo/CommonResource");
const Dao = require('./Dao');

class CommonResourceDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('common_resource');
    }

    static model = CommonResource;

    static requireInsertFieldList() {
        return [
            CommonResource.Schema.RESOURCE_ID.key,
            CommonResource.Schema.VERSION.key,
            CommonResource.Schema.CRC32.key,
            CommonResource.Schema.SIZE.key,
            CommonResource.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            CommonResource.Schema.VERSION.key,
            CommonResource.Schema.CRC32.key,
            CommonResource.Schema.SIZE.key,
            CommonResource.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = CommonResourceDao;