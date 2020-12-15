const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    EDIT_KEY: { key: 'editKey', required: true, type: ValidType.STRING },
    REASON: {key: 'reason', required: true, type: ValidType.STRING },
    UPDATE_DATE: {key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class UserEdit extends Model {
    constructor({ adminId, uid, editKey, reason, updateDate }) {
        super();
        this[Schema.ADMIN_ID.key] = ValidateUtil.setNullUndefined(adminId);
        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.EDIT_KEY.key] = ValidateUtil.setNullUndefined(editKey);
        this[Schema.REASON.key] = ValidateUtil.setNullUndefined(reason);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }

    getAdminId() {
        return this[Schema.ADMIN_ID.key];
    }
}

module.exports = UserEdit;
module.exports.Schema = Schema;
