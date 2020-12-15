const Story = require('../models/mongo/Story');
const Dao = require('./Dao');

class StoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('story');
        this.collection.createIndex({ storyId: 1 }, { unique: true });
    }
    
    static model = Story;

    static requireInsertFieldList() {
        return [
            Story.Schema.STORY_ID.key,
            Story.Schema.STATUS.key,
            Story.Schema.VERSION.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Story.Schema.STATUS.key,
            Story.Schema.VERSION.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            Story.Schema.STORY_ID.key
        ]
    };
}

module.exports = StoryDao;