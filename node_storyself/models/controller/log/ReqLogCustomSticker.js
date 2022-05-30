const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    CONTENTS_ID: { key: 'contentsId', required: false, type: ValidType.NUMBER },
    CONTENTS_COUNT: { key: 'contentsCount', required: false, type: ValidType.NUMBER },
}

class ReqLogCustomSticker extends Model {
    constructor({ contentsId, contentsCount }) {
        super();

        this[Schema.CONTENTS_ID.key] = contentsId;
        this[Schema.CONTENTS_COUNT.key] = contentsCount;
    }
}

module.exports = ReqLogCustomSticker;
module.exports.Schema = Schema;