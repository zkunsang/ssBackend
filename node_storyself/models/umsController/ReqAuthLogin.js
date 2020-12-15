const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
}

class ReqAuthLogin extends Model {
    constructor({ adminId, password }) {
        super();
        this[Schema.ADMIN_ID.key] = adminId;
        this[Schema.PASSWORD.key] = password;
    }

    getAdminId() {
        return this[Schema.ADMIN_ID.key];
    }

    getPassword() {
        return this[Schema.PASSWORD.key];
    }
}

module.exports = ReqAuthLogin;
module.exports.Schema = Schema;
