const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
}

class ReqUserQuestDelete extends Model {
    constructor({ uid }) {
        super();
        this[Schema.UID.key] = uid;
    }

    getUID() {
        return this[Schema.UID.key];
    }
}

module.exports = ReqUserQuestDelete;
module.exports.Schema = Schema;
