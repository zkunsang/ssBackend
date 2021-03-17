const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    MAIL_ID: { key: 'mailId', required: true, type: ValidType.STRING },
}

class ReqCheatReadMail extends Model {
    constructor({ mailId }) {
        super();
        this[Schema.MAIL_ID.key] = mailId;
        
    }

    getMailId() {
        return this[Schema.MAIL_ID.key];
    }
}

module.exports = ReqCheatReadMail;
module.exports.Schema = Schema;