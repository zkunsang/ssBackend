const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    INSERT_LIST: { key: 'insertList', required: true, type: ValidType.ARRAY },
    UPDATE_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
}

class ReqResourceUpdate extends Model {
    constructor({ storyId, insertList, updateList }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.INSERT_LIST.key] = insertList;
        this[Schema.UPDATE_LIST.key] = updateList;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getInsertList() {
        return this[Schema.INSERT_LIST.key];
    }
}

module.exports = ReqResourceUpdate;
module.exports.Schema = Schema;