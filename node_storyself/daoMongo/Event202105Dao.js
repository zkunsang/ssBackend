const Event202105 = require('../models/mongo/Event202105');
const Dao = require('./Dao');

class Event202105Dao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('event');
        this.collection = this.db.collection('evt202105');
    }

    static model = Event202105;

    static requireInsertFieldList() {
        return [
            Event202105.Schema.UID.key,
            Event202105.Schema.STORY_LIST.key,
            Event202105.Schema.UPDATE_DATE.key
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

module.exports = Event202105Dao;