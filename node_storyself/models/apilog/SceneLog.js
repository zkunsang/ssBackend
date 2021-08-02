const DateUtil = require('../../util/DateUtil');
const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    LANG: { key: 'lang', required: false, type: ValidType.STRING },
    SCENE_INDEX: { key: 'sceneIndex', required: false, type: ValidType.NUMBER },
    ELAPSED_TIME: { key: 'elapsedTime', required: false, type: ValidType.NUMBER },
    LOG_DATE: { key: 'logDate', required: false, type: ValidType.UNIX_TIMESTAMP },
}

class VoiceLog extends Model {
    constructor({ uid, storyId, lang, sceneIndex, elapsedTime, logDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.LANG.key] = lang;
        this[Schema.SCENE_INDEX.key] = sceneIndex;
        this[Schema.ELAPSED_TIME.key] = elapsedTime;
        this[Schema.LOG_DATE.key] = logDate;

        this.logDateTZ = DateUtil.utsToDs(logDate);
    }
}

module.exports = VoiceLog;
module.exports.Schema = Schema;