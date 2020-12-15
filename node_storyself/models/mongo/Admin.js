const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const AdminRole = ValidateUtil.AdminRole;
const AdminStatus = ValidateUtil.AdminStatus;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
    ADMIN_ROLE: { key: 'adminRole', required: true, type: ValidType.STRING, validRange: Object.values(AdminRole) },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(AdminStatus) }
}

class Admin extends Model {
    constructor({ adminId, password, adminRole, createDate, status }) {
        super();
        this[Schema.ADMIN_ID.key] = ValidateUtil.setNullUndefined(adminId);
        this[Schema.PASSWORD.key] = ValidateUtil.setNullUndefined(password);
        this[Schema.ADMIN_ROLE.key] = ValidateUtil.setNullUndefined(adminRole);
        this[Schema.CREATE_DATE.key] = ValidateUtil.setNullUndefined(createDate);
        this[Schema.STATUS.key] = ValidateUtil.setNullUndefined(status);
    }

    setAdminRole(adminRole) {
        this[Schema.ADMIN_ROLE.key] = adminRole;
    }

    setCreateDate(createDate) {
        this[Schema.CREATE_DATE.key] = createDate;
    }

    setStatus(status) {
        this[Schema.STATUS.key] = status;
    }

    getAdminId() {
        return this[Schema.ADMIN_ID.key];
    }
}

module.exports = Admin;
module.exports.Schema = Schema;
module.exports.AdminStatus = AdminStatus;
module.exports.AdminRole = AdminRole;