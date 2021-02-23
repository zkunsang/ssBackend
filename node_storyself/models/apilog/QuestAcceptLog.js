const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: false, type: ValidType.STRING },
    LOG_DATE: { key: 'logDate', required: false, type: ValidType.UNIX_TIMESTAMP }
}

class QuestAcceptLog extends Model {
    constructor({ uid, storyId, questId, logDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.QUEST_ID.key] = questId;
        this[Schema.LOG_DATE.key] = logDate;

        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = QuestAcceptLog;
module.exports.Schema = Schema;