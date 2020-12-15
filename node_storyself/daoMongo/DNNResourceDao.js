const DNNResource = require("../models/mongo/DNNResource");
const Dao = require('./Dao');

class DNNResourceDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('dnn_resource');
    }

    static model = DNNResource;

    static requireInsertFieldList() {
        return [
            DNNResource.Schema.RESOURCE_ID.key,
            DNNResource.Schema.VERSION.key,
            DNNResource.Schema.CRC32.key,
            DNNResource.Schema.SIZE.key,
            DNNResource.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            DNNResource.Schema.VERSION.key,
            DNNResource.Schema.CRC32.key,
            DNNResource.Schema.SIZE.key,
            DNNResource.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = DNNResourceDao;