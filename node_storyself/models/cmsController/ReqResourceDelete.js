const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    RESOURCE_ID: { key: 'resourceId', required: true, type: ValidType.STRING }
}

class ReqResourceDelete extends Model {
    constructor({ storyId, resourceId }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.RESOURCE_ID.key] = resourceId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getResourceId() {
        return this[Schema.RESOURCE_ID.key];
    }
}

module.exports = ReqResourceDelete;
module.exports.Schema = Schema;