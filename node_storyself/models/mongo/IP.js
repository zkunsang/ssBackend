const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    IP: { key: 'ip', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP},
    MEMO: { key: 'memo', required: true, type: ValidType.ARRAY },
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    TYPE: { key: 'type', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER }
}

class IP extends Model {
    constructor({ ip, updateDate, memo, adminId, type, status }) {
        super();
        this[Schema.IP.key] = ValidateUtil.setNullUndefined(ip);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
        this[Schema.MEMO.key] = ValidateUtil.setNullUndefined(memo);
        this[Schema.ADMIN_ID.key] = ValidateUtil.setNullUndefined(adminId);
        this[Schema.TYPE.key] = ValidateUtil.setNullUndefined(type);
        this[Schema.STATUS.key] = ValidateUtil.setNullUndefined(status);
    }

    getMemoList() {
        return this[Schema.MEMO.key];
    }
};

module.exports = IP;
module.exports.Schema = Schema;