const StoryTempEvent = require('../models/mongo/StoryTempEvent');
const Dao = require('./Dao');

class StoryTempEventDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('event');
        this.collection = this.db.collection('temp');
    }
    
    static model = StoryTempEvent;

    static requireInsertFieldList() {
        return [
            StoryTempEvent.Schema.UID.key,
            StoryTempEvent.Schema.STORY_ID.key,
            StoryTempEvent.Schema.UPDATE_DATE.key
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

module.exports = StoryTempEventDao;