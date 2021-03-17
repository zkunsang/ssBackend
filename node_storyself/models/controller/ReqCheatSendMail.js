const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const MailSender = ValidateUtil.MailSender;
const ValidType = ValidateUtil.ValidType;

const Schema = {
    TITLE: { key: 'title', required: true, type: ValidType.STRING },
    MESSAGE: { key: 'message', required: true, type: ValidType.STRING },
    SENDER: { key: 'sender', required: true, type: ValidType.NUMBER, validRange: Object.values(MailSender) }, 
    SENDER_ID: { key: 'senderId', required: false, type: ValidType.STRING },
    ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
}

class ReqCheatSendMail extends Model {
    constructor({ title, message, sender, senderId, itemList }) {
        super();
        this[Schema.TITLE.key] = title;
        this[Schema.MESSAGE.key] = message;
        this[Schema.SENDER.key] = sender;
        this[Schema.SENDER_ID.key] = senderId;
        this[Schema.ITEM_LIST.key] = itemList;
    }

    getItemList() {
        return InventoryDao.mappingList(this[Schema.ITEM_LIST.key]);
    }

    getTitle() {
        return this[Schema.TITLE.key];
    }

    getMessage() {
        return this[Schema.MESSAGE.key];
    }

    getMailSender() {
        return this[Schema.SENDER.key];
    }
}

module.exports = ReqCheatSendMail;
module.exports.Schema = Schema;