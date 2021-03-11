const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    SESSION_ID: { key: 'sessionId', required: true, type: ValidType.STRING },
}

class ReqAuthUser extends Model {
    constructor({ sessionId }) {
        super();
        this[Schema.SESSION_ID.key] = sessionId;
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }
}

module.exports = ReqAuthUser;
module.exports.Schema = Schema;
