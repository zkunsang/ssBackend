const Model = require('../../models');
const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
}

class ReqUserInfo extends Model {
    constructor({ uid }) {
        super();

        this[Schema.UID.key] = uid;
    }

    getUid() {
        return this[Schema.UID.key];
    }
}

module.exports = ReqUserInfo;
module.exports.Schema = Schema;