const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', require: true, type: ValidType.STRING },
    ACTION_LIST: { key: 'actionList', required: true, type: ValidType.ARRAY },
}

class ReqUserAction extends Model {
    constructor({ storyId, actionList }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.ACTION_LIST.key] = actionList;
    }

    getActionList() {
        return this[Schema.ACTION_LIST.key];
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqUserAction;
module.exports.Schema = Schema;