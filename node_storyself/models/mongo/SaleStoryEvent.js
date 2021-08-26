const Model = require('..');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    TARGET: { key: 'target', required: false, type: ValidType.STRING },
    METHOD: { key: 'method', required: false, type: ValidType.STRING },
    VALUE: { key: 'value', required: false, type: ValidType.STRING },
    START_DATE: { key: 'startDate', required: false, type: ValidType.NUMBER },
    END_DATE: { key: 'endDate', required: false, type: ValidType.NUMBER },
    GROUP: { key: 'group', required: false, type: ValidType.NUMBER },
    STORY_LIST: { key: 'storyList', required: false, type: ValidType.ARRAY },
}

class SaleStoryEvent extends Model {
    constructor({ target, method, value, startDate, endDate, group, storyList }) {
        super();

        this[Schema.TARGET.key] = ValidateUtil.setNullUndefined(target)
        this[Schema.METHOD.key] = ValidateUtil.setNullUndefined(method)
        this[Schema.VALUE.key] = ValidateUtil.setNullUndefined(value)
        this[Schema.START_DATE.key] = ValidateUtil.setNullUndefined(startDate)
        this[Schema.END_DATE.key] = ValidateUtil.setNullUndefined(endDate)
        this[Schema.GROUP.key] = ValidateUtil.setNullUndefined(group)
        this[Schema.STORY_LIST.key] = ValidateUtil.setNullUndefined(storyList)
    }
}

module.exports = SaleStoryEvent;
module.exports.Schema = Schema;