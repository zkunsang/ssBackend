const Resource = require("../models/mongo/Resource");
const Dao = require('./Dao');

class ResourceDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('resource');
    }

    static model = Resource;

    static requireInsertFieldList() {
        return [
            Resource.Schema.STORY_ID.key,
            Resource.Schema.RESOURCE_ID.key,
            Resource.Schema.SIZE.key,
            Resource.Schema.VERSION.key,
            Resource.Schema.CRC32.key,
            Resource.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Resource.Schema.SIZE.key,
            Resource.Schema.VERSION.key,
            Resource.Schema.CRC32.key,
            Resource.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            Resource.Schema.STORY_ID.key,
            Resource.Schema.RESOURCE_ID.key,
        ]
    };
}

module.exports = ResourceDao;