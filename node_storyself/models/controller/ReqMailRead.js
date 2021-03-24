const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    MAIL_ID: { key: 'mailId', required: true, type: ValidType.STRING },
}

class ReqMailRead extends Model {
    constructor({ mailId }) {
        super();
        this[Schema.MAIL_ID.key] = mailId;

    }

    getMailId() {
        return this[Schema.MAIL_ID.key];
    }
}

module.exports = ReqMailRead;
module.exports.Schema = Schema;