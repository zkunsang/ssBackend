const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    BEFORE: { key: 'before', required: false, type: ValidType.ARRAY },
    AFTER: { key: 'after', required: false, type: ValidType.ARRAY },
}

class ReqLogPreview extends Model {
    constructor({ storyId, before, after }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.BEFORE.key] = before;
        this[Schema.AFTER.key] = after;
    }
}

module.exports = ReqLogPreview;
module.exports.Schema = Schema;