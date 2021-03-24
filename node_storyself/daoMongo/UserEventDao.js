const UserEvent = require('../models/mongo/UserEvent');
const Dao = require('./Dao');

class UserEventDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('user');
        this.collection = this.db.collection('event');
    }

    static model = UserEvent;

    static requireInsertFieldList() {
        return [
            UserEvent.Schema.UID.key,
            UserEvent.Schema.EVENT_INFO.key,
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

module.exports = UserEventDao;