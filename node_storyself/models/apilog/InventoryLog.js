const DateUtil = require('../../util/DateUtil');
const Model = require('..');

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
    QUEST_ID: { key: 'questId', required: false, type: ValidType.STRING },
    QUEST_SID: { key: 'questSId', required: false, type: ValidType.STRING }, // 스토리 아이디
}

class InventoryLog extends Model {
    constructor({ uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate, action, addInfo }) {
        super();
        this[Schema.UID.key] = uid;

        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_CATEGORY.key] = itemCategory;

        this[Schema.DIFF_QNY.key] = diffQny;
        this[Schema.BEFORE_QNY.key] = beforeQny;
        this[Schema.AFTER_QNY.key] = afterQny;
        
        this[Schema.LOG_DATE.key] = logDate;
        
        this.logDateTZ = DateUtil.utsToDs(logDate);

        this.parseAddInfo(addInfo);
        this.parseAction(action);
    }

    parseAction(action) {
        this[Schema.ACTION.key] = action[0];
        this[Schema.SUB_ACTION.key] = action[1];
    }

    parseAddInfo(addInfo) {
        if(!addInfo) return;
        const { adminInfo, questInfo } = addInfo;

        this.parseAdminInfo(adminInfo);
        this.parseQuestInfo(questInfo);
    }

    parseAdminInfo(adminInfo) {
        if (adminInfo) {
            const { adminId, editKey } = adminInfo;
            this[Schema.ADMIN_ID.key] = adminId;
            this[Schema.EDIT_KEY.key] = editKey;
        }
    }

    parseQuestInfo(questInfo) {
        if (questInfo) {
            const { questSId, questId } = questInfo;
            this[Schema.QUEST_ID.key] = questId;
            this[Schema.QUEST_SID.key] = questSId;
        }
    }
}

module.exports = InventoryLog;
module.exports.Schema = Schema;