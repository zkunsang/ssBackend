const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    IP: { key: 'ip', required: true, type: ValidType.STRING },
    TYPE: { key: 'type', required: true, type: ValidType.STRING },
}

class ReqIPDelete extends Model{
    constructor({ ip, type }) {
        super();
        this[Schema.IP.key] = ip;
        this[Schema.TYPE.key] = type;
    }

    getIP() {
        return this[Schema.IP.key];
    }

    getType() {
        return this[Schema.TYPE.key];
    }
}

module.exports = ReqIPDelete;
module.exports.Schema = Schema;