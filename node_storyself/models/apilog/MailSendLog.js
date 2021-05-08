const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const MailSender = ValidateUtil.MailSender;
const MailStatus = ValidateUtil.MailStatus;
const ValidType = ValidateUtil.ValidType;

// 아이템 리스트에는 획득처가 등록되어 있어야 한다.
const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    MAIL_ID: { key: 'mailId', required: false, type: ValidType.STRING },
    TITLE: { key: 'title', required: true, type: ValidType.STRING },
    MESSAGE: { key: 'message', required: true, type: ValidType.STRING },
    SENDER: { key: 'sender', required: true, type: ValidType.NUMBER, validRange: Object.values(MailSender) },
    SENDER_ID: { key: 'senderId', required: false, type: ValidType.STRING },
    STATUS: { key: 'status', required: false, type: ValidType.NUMBER, validRange: Object.values(MailStatus) },
    DATE: { key: 'date', required: false, type: ValidType.UNIX_TIMESTAMP },
    ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
    ITEM_INFO: { key: 'itemInfo', required: false, type: ValidType.OBJECT }
}

class MailSendLog extends Model {
    constructor({ uid, mailId, title, message, sender, senderId, status, date, itemList, itemInfo }) {
        super();
        this[Schema.UID.key] = uid;

        this[Schema.MAIL_ID.key] = mailId;
        this[Schema.TITLE.key] = title;

        this[Schema.MESSAGE.key] = message;
        this[Schema.SENDER.key] = sender;
        this[Schema.SENDER_ID.key] = senderId;
        this[Schema.STATUS.key] = status;

        this[Schema.ITEM_LIST.key] = itemList;
        this[Schema.ITEM_INFO.key] = itemInfo;

        this[Schema.DATE.key] = date;

        this.dateTZ = DateUtil.utsToDs(date);
    }
}

module.exports = MailSendLog;
module.exports.Schema = Schema;