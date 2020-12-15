const Admin = require("../models/mongo/Admin");
const Dao = require('./Dao');

class AdminDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('cms');
        this.collection = this.db.collection('admin');
    }

    static model = Admin;

    static requireInsertFieldList() {
        return [
            Admin.Schema.ADMIN_ID.key,
            Admin.Schema.PASSWORD.key,
            Admin.Schema.ADMIN_ROLE.key,
            Admin.Schema.CREATE_DATE.key,
            Admin.Schema.STATUS.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Admin.Schema.ADMIN_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            Admin.Schema.ADMIN_ROLE.key,
            Admin.Schema.PASSWORD.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            Admin.Schema.ADMIN_ID.key,
        ]
    };
}

module.exports = AdminDao;