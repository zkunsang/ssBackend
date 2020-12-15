const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
}

class ReqResourceList extends Model{
    constructor({ storyId }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqResourceList;
module.exports.Schema = Schema;