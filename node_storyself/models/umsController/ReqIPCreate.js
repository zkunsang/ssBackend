const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const IpManageType = ValidateUtil.IpManageType;

const Schema = {
    IP: { key: 'ip', required: true, type: ValidType.STRING },
    MEMO: { key: 'memo', required: true, type: ValidType.STRING },
    TYPE: { key: 'type', required: true, type: ValidType.STRING, validRange: Object.values(IpManageType)},
}

class ReqIPCreate extends Model{
    constructor({ ip, memo, type }) {
        super();
        this[Schema.IP.key] = ip;
        this[Schema.MEMO.key] = memo;
        this[Schema.TYPE.key] = type;
    }

    getIP() {
        return this[Schema.IP.key];
    }

    getMemo() {
        return this[Schema.MEMO.key];
    }

    getType() {
        return this[Schema.TYPE.key];
    }
}

module.exports = ReqIPCreate;
module.exports.Schema = Schema;