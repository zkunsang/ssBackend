const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const IpManageType = ValidateUtil.IpManageType;

const Schema = {
    IP: { key: 'ip', required: true, type: ValidType.STRING },
    MEMO: { key: 'memo', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.STRING, validRange: Object.values(IpManageType)},
}

class ReqIPEdit extends Model{
    constructor({ ip, status, memo }) {
        super();
        this[Schema.IP.key] = ip;
        this[Schema.STATUS.key] = status;
        this[Schema.MEMO.key] = memo;
    }

    getIP() {
        return this[Schema.IP.key];
    }

    getMemo() {
        return this[Schema.MEMO.key];
    }

    getStatus() {
        return this[Schema.STATUS.key];
    }
}

module.exports = ReqIPEdit;
module.exports.Schema = Schema;