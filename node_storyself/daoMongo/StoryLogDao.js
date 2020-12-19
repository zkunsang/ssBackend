const StoryLog = require('../models/mongo/StoryLog');
const Dao = require('./Dao');

class StoryLogDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('log');
        this.collection = this.db.collection('story_log');
    }
    
    static model = StoryLog;

    static requireInsertFieldList() {
        return [
            StoryLog.Schema.UID.key,
            StoryLog.Schema.STORY_ID.key,
            StoryLog.Schema.TYPE.key,
            StoryLog.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return []
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = StoryLogDao;