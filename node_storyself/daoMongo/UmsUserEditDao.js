const UserEdit = require("../models/mongo/UserEdit");
const Dao = require('./Dao');

class UmsAdminDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('ums');
        this.collection = this.db.collection('useredit');
    }

    static model = UserEdit;

    static requireInsertFieldList() {
        return [
            UserEdit.Schema.ADMIN_ID.key,
            UserEdit.Schema.UID.key,
            UserEdit.Schema.EDIT_KEY.key,
            UserEdit.Schema.REASON.key,
            UserEdit.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [
            UserEdit.Schema.EDIT_KEY.key,
            UserEdit.Schema.ADMIN_ID.key,
            UserEdit.Schema.UID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            UserEdit.Schema.ADMIN_ID.key,
            UserEdit.Schema.UID.key,
            UserEdit.Schema.EDIT_KEY.key,
            UserEdit.Schema.REASON.key,
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = UmsAdminDao;