const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const MailSender = ValidateUtil.MailSender;

const Schema = {
    MAIL_ID: { key: 'mailId', required: true, type: ValidType.STRING },
    TITLE: { key: 'title', required: true, type: ValidType.STRING },
    MESSAGE: { key: 'message', required: true, type: ValidType.STRING },
    SENDER: { key: 'sender', required: true, type: ValidType.NUMBER, validRange: Object.values(MailSender) }, 
    ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
    ITEM_INFO: { key: 'itemInfo', required: false, type: ValidType.Object },
    STATUS: { key: 'status', required: false, type: ValidType.Object },
}

class Mail extends Model {
    constructor({ mailId, title, message, sender, status, itemList, itemInfo }) {
        super();
           
        this[Schema.MAIL_ID.key] = mailId;
        this[Schema.TITLE.key] = title;
        this[Schema.MESSAGE.key] = message;
        this[Schema.SENDER.key] = sender;
        this[Schema.ITEM_LIST.key] = itemList;
        this[Schema.ITEM_INFO.key] = itemInfo;
        this[Schema.STATUS.key] = status;
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
