const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// 202105 무료 스토리 이엡트
const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STORY_LIST: { key: 'storyList', required: true, type: ValidType.ARRAY },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class Event202105 extends Model {
    constructor({ uid, storyList, updateDate }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.STORY_LIST.key] = ValidateUtil.setNullUndefined(storyList);
        this[Schema.UPDATE_DATE.key] = ValidateUtil.setNullUndefined(updateDate);
    }
}

module.exports = Event202105;
module.exports.Schema = Schema;