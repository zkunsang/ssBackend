const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY: { key: 'story', required: false, type: ValidType.ARRAY }
}

class SaleEvent extends Model {
    constructor({ story }) {
        super();

        this[Schema.STORY.key] = ValidateUtil.setNullUndefined(story)
    }
}


module.exports = SaleEvent;
module.exports.Schema = Schema;