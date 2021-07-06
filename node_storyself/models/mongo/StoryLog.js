const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const StoryLogType = {
    START: 1,
    END: 2
}

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    START_KEY: { key: 'startKey', required: true, type: ValidType.STRING },
    TYPE: { key: 'type', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },

    ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
    FACE_LIST: { key: 'faceList', required: false, type: ValidType.ARRAY },
    READ_TIME: { key: 'readTime', required: false, type: ValidType.NUMBER },

    READ_PAGE: { key: 'readPage', required: false, type: ValidType.NUMBER },
    RECORD: { key: 'record', required: false, type: ValidType.NUMBER },
    RECORD_CURRENT: { key: 'recordCurrent', required: false, type: ValidType.NUMBER },

    FORCE_END: { key: 'forceEnd', required: false, type: ValidType.BOOLEAN },
}

class StoryLog extends Model {
    constructor({ uid, storyId, type, updateDate, startKey, faceList, itemList, readTime, readPage, record, recordCurrent, forceEnd }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.START_KEY.key] = ValidateUtil.setNullUndefined(startKey);
        this[Schema.TYPE.key] = ValidateUtil.setNullUndefined(type);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);

        this[Schema.FACE_LIST.key] = faceList;
        this[Schema.ITEM_LIST.key] = itemList;
        this[Schema.READ_TIME.key] = readTime;

        this[Schema.READ_PAGE.key] = readPage;
        this[Schema.RECORD.key] = record;
        this[Schema.RECORD_CURRENT.key] = recordCurrent;

        this[Schema.FORCE_END.key] = forceEnd;
    }
}

module.exports = StoryLog;
module.exports.Schema = Schema;
module.exports.StoryLogType = StoryLogType;