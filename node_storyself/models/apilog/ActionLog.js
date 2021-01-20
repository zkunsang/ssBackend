const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    ACTION_TYPE: { key: 'actionType', required: false, type: ValidType.NUMBER },
    ACTION_DATE: { key: 'actionDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    ACTION_ID: { key: 'actionId', required: false, type: ValidType.NUMBER }
}

class ActionLog extends Model {
    constructor({ uid, storyId, actionType, actionDate, actionId }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.ACTION_TYPE.key] = actionType;
        this[Schema.ACTION_DATE.key] = actionDate;
        this[Schema.ACTION_ID.key] = actionId;

        this.logDateTZ = DateUtil.utsToDs(actionDate);
    }
}

module.exports = ActionLog;
module.exports.Schema = Schema;