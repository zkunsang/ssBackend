const Model = require('..');
const moment = require('moment');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: false, type: ValidType.STRING },
    ITEM_CATEGORY: { key: 'itemCategory', required: false, type: ValidType.STRING },
    BEFORE_QNY: { key: 'beforeQny', required: false, type: ValidType.NUMBER },
    AFTER_QNY: { key: 'afterQny', required: false, type: ValidType.NUMBER },
    DIFF_QNY: {key: 'diffQny', required: false, type: ValidType.NUMBER },
    LOG_DATE: { key: 'logDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    ACTION: { key: 'action', required: false, type: ValidType.NUMBER },
    SUB_ACTION: { key: 'subAction', required: false, type: ValidType.NUMBER },
    ADMIN_ID: { key: 'adminId', required: false, type: ValidType.STRING },
    EDIT_KEY: { key: 'editKey', required: false, type: ValidType.STRING },
}

class InvenLog extends Model {
    constructor({ uid, itemId, itemCategory, diffQny, beforeQny, afterQny, action, logDate, adminId, editKey }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.DIFF_QNY.key] = diffQny;
        this[Schema.BEFORE_QNY.key] = beforeQny;
        this[Schema.AFTER_QNY.key] = afterQny;
        this[Schema.ACTION.key] = action[0];
        this[Schema.SUB_ACTION.key] = action[1];
        this[Schema.LOG_DATE.key] = logDate;
        this[Schema.EDIT_KEY.key] = editKey;
        this[Schema.ADMIN_ID.key] = adminId;

        this.logDateTZ = moment.unix(logDate).format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = InvenLog;
module.exports.Schema = Schema;