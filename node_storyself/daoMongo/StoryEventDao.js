const StoryEvent = require('../models/mongo/StoryEvent');
const Dao = require('./Dao');

class StoryEventDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('user');
        this.collection = this.db.collection('storyEvent');
    }

    static model = StoryEvent;

    static requireInsertFieldList() {
        return [
            StoryEvent.Schema.UID.key,
            StoryEvent.Schema.STORY_ID.key,
            StoryEvent.Schema.UPDATE_DATE.key
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

module.exports = StoryEventDao;