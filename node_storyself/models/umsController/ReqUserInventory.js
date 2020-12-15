const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING }
}

class ReqUserInventory extends Model {
    constructor({ uid }) {
        super();
        this[Schema.UID.key] = uid;
    }

    getUid() {
        return this[Schema.UID.key];
    }
}

module.exports = ReqUserInventory;
module.exports.Schema = Schema;