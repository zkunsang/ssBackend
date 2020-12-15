const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
    CONFIRM_PASSWORD: { key: 'confirmPassword', required: true, type: ValidType.STRING },
}

class ReqAuthRegist extends Model{
    constructor({ adminId, password, confirmPassword }) {
        super();
        this[Schema.ADMIN_ID.key] = adminId;
        this[Schema.PASSWORD.key] = password;
        this[Schema.CONFIRM_PASSWORD.key] = confirmPassword;
    }
}

module.exports = ReqAuthRegist;
module.exports.Schema = Schema;
