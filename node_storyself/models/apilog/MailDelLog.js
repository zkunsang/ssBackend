const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const MailStatus = ValidateUtil.MailStatus;
const ValidType = ValidateUtil.ValidType;

// 아이템 리스트에는 획득처가 등록되어 있어야 한다.
const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    MAIL_ID: { key: 'mailId', required: false, type: ValidType.STRING },
    STATUS: { key: 'status', required: false, type: ValidType.NUMBER, validRange: Object.values(MailStatus) },
    DEL_ID: { key: 'delId', required: false, type: ValidType.STRING },
    DATE: { key: 'date', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class MailDelLog extends Model {
    constructor({ uid, mailId, status, date, delId }) {
        super();
        this[Schema.UID.key] = uid;

        this[Schema.MAIL_ID.key] = mailId;
        this[Schema.STATUS.key] = status;
        this[Schema.DEL_ID.key] = delId;
        this[Schema.DATE.key] = date;

        this.dateTZ = DateUtil.utsToDs(date);
    }
}

module.exports = MailDelLog;
module.exports.Schema = Schema;