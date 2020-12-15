const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_LIST: { key: 'storyList', required: true, type: ValidType.ARRAY, },
}

class ReqStoryUpdateMany extends Model {
    constructor({ storyList }) {
        super();
        this[Schema.STORY_LIST.key] = storyList;
    }

    getStoryList() {
        return this[Schema.STORY_LIST.key];
    }
}

module.exports = ReqStoryUpdateMany;
module.exports.Schema = Schema;