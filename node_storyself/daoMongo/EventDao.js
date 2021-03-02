const Event = require('../models/mongo/Event');
const Dao = require('./Dao');

class EventDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('user');
        this.collection = this.db.collection('event');
    }
    
    static model = Event;

    static requireInsertFieldList() {
        return [
            Event.Schema.UID.key,
            Event.Schema.EVENT_INFO.key,
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

module.exports = EventDao;