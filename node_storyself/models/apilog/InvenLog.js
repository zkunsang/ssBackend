const Model = require('..');
const moment = require('moment');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING },
    BEFORE_QNY: { key: 'beforeQny', required: true, type: ValidType.NUMBER },
    AFTER_QNY: { key: 'afterQny', required: true, type: ValidType.NUMBER },
    DIFF_QNY: {key: 'diffQny', required: true, type: ValidType.NUMBER },
    SUB_ACTION: { key: 'subAction', required: true, type: ValidType.NUMBER },
    LOG_DATE: { key: 'logDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    ACTION: { key: 'action', required: true, type: ValidType.ARRAY },
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
        this[Schema.LOG_DATE.key] = moment.unix(logDate).format("YYYY-MM-DD HH:mm:ss");
        this[Schema.EDIT_KEY.key] = editKey;
        this[Schema.ADMIN_ID.key] = adminId;
    }
}

module.exports = InvenLog;
module.exports.Schema = Schema;