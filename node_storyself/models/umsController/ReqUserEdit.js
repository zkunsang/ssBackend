const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    INVENTORY: { key: 'inventory', required: false, type: ValidType.ARRAY },
    STATUS: { key: 'status', required: false, type: ValidType.NUMBER },
    REASON: { key: 'reason', required: true, type: ValidType.STRING },
}

class ReqUserEdit extends Model {
    constructor({ uid, inventory, reason }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.INVENTORY.key] = inventory;
        this[Schema.REASON.key] = reason;
    }

    getUid() {
        return this[Schema.UID.key];
    }

    getInventoryList() {
        return this[Schema.INVENTORY.key];
    }

    getReason() {
        return this[Schema.REASON.key];
    }
}

module.exports = ReqUserEdit;
module.exports.Schema = Schema;