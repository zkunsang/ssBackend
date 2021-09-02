const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const MailSender = ValidateUtil.MailSender;

const Schema = {
    MAIL_ID: { key: 'mailId', required: true, type: ValidType.STRING },

    TITLE: { key: 'title', required: false, type: ValidType.STRING },
    TITLE_EN: { key: 'title_en', required: false, type: ValidType.STRING },
    MESSAGE: { key: 'message', required: false, type: ValidType.STRING },
    MESSAGE_EN: { key: 'message_en', required: false, type: ValidType.STRING },
    SENDER: { key: 'sender', required: true, type: ValidType.NUMBER, validRange: Object.values(MailSender) },

    ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
    ITEM_INFO: { key: 'itemInfo', required: false, type: ValidType.Object },

    STATUS: { key: 'status', required: false, type: ValidType.Object },

    WRITE_DATE: { key: 'writeDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    READ_DATE: { key: 'readDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    DUE_DATE: { key: 'dueDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class Mail extends Model {
    constructor({ mailId, title, title_en, message, message_en, sender, status, itemList, itemInfo, writeDate, readDate, dueDate }) {
        super();

        this[Schema.MAIL_ID.key] = mailId;

        this[Schema.TITLE.key] = title;
        this[Schema.TITLE_EN.key] = title_en;

        this[Schema.MESSAGE.key] = message;
        this[Schema.MESSAGE_EN.key] = message_en;

        this[Schema.SENDER.key] = sender;
        this[Schema.ITEM_LIST.key] = itemList;
        this[Schema.ITEM_INFO.key] = itemInfo;
        this[Schema.STATUS.key] = status;

        this[Schema.WRITE_DATE.key] = writeDate;
        this[Schema.READ_DATE.key] = readDate;
        this[Schema.DUE_DATE.key] = dueDate;
    }

    getItemList() {
        return [Schema.ITEM_LIST.key];
    }

    getItemInfo() {
        return [Schema.ITEM_INFO.key];
    }

}

module.exports = Mail;
module.exports.Schema = Schema;
