const Model = require('../../../models');

const ValidateUtil = require('../../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    CONFIRM_KEY: { key: 'confirmKey', required: true, type: ValidType.STRING },
}

class ReqQRConfirm extends Model {
    constructor({ confirmKey }) {
        super();
        this[Schema.CONFIRM_KEY.key] = confirmKey;
    }

    getConfirmKey() {
        return this[Schema.CONFIRM_KEY.key];
    }
}

module.exports = ReqQRConfirm;
module.exports.Schema = Schema;