const ServiceVariable = require('../models/mongo/ServiceVariable');
const Dao = require('./Dao');

class ServiceVariableDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('serviceVariable');
    }
    
    static model = ServiceVariable;

    static requireInsertFieldList() {
        return [
            ServiceVariable.Schema.KEY.key,
            ServiceVariable.Schema.VALUE.key,
            ServiceVariable.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            ServiceVariable.Schema.VALUE.key,
            ServiceVariable.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            ServiceVariable.Schema.KEY.key,
        ]
    };
}

module.exports = ServiceVariableDao;