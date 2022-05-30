const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ID: { key: 'id', required: false, type: ValidType.STRING },
    END_TYPE: { key: 'endType', required: false, type: ValidType.NUMBER },
    ELAPSED_TIME: { key: 'elapsedTime', required: false, type: ValidType.NUMBER },
}

class ReqLogStreaming extends Model {
    constructor({ id, endType, elapsedTime }) {
        super();

        this[Schema.ID.key] = id;
        this[Schema.END_TYPE.key] = endType;
        this[Schema.ELAPSED_TIME.key] = elapsedTime;
    }
}

module.exports = ReqLogStreaming;
module.exports.Schema = Schema;