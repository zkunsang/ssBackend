const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    MAIL_ID: { key: 'mailId', required: true, type: ValidType.STRING },
    DEL_ID: { key: 'delId', required: true, type: ValidType.STRING },
}

class ReqMailDelete extends Model {
    constructor({ mailId, delId }) {
        super();
        this[Schema.MAIL_ID.key] = mailId;
        this[Schema.DEL_ID.key] = delId;
    }

    getMailId() {
        return this[Schema.MAIL_ID.key];
    }

    getDelId() {
        return this[Schema.DEL_ID.key];
    }
}

module.exports = ReqMailDelete;
module.exports.Schema = Schema;