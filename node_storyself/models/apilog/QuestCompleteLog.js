const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: false, type: ValidType.STRING },
    COMPLETE_TYPE: { key: 'completeType', required: false, type: ValidType.NUMBER },
    ACCEPT_DATE: { key: 'acceptDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    LOG_DATE: { key: 'logDate', required: false, type: ValidType.UNIX_TIMESTAMP }
}

class QuestCompleteLog extends Model {
    constructor({ uid, storyId, questId, completeType, acceptDate, logDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.QUEST_ID.key] = questId.toString();
        this[Schema.COMPLETE_TYPE.key] = completeType;
        this[Schema.ACCEPT_DATE.key] = acceptDate;
        this[Schema.LOG_DATE.key] = logDate;
        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = QuestCompleteLog;
module.exports.Schema = Schema;