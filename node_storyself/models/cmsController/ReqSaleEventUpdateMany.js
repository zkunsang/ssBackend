const Model = require('..')

const ValidateUtil = require('@ss/util/ValidateUtil');

const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY: { key: 'story', required: true, type: ValidType.ARRAY },
}

class ReqSaleEventUpdateMany extends Model {
    constructor({ story }) {
        super();
        this[Schema.STORY.key] = story;
    }

    getStoryList() {
        return this[Schema.STORY.key];
    }
}

module.exports = ReqSaleEventUpdateMany;
module.exports.Schema = Schema;

