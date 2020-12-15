const Version = require('../models/mongo/Version');
const Dao = require('./Dao');

class VersionDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('appVersion');
    }
    
    static model = Version;

    static requireInsertFieldList() {
        return [
            Version.Schema.OS_TYPE.key,
            Version.Schema.UPDATE_DATE.key,
            Version.Schema.VERSION.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Version.Schema.UPDATE_DATE.key,
            Version.Schema.VERSION.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            Version.Schema.OS_TYPE.key,
        ]
    };
}

module.exports = VersionDao;