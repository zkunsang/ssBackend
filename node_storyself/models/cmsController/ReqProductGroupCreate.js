const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    GROUP_ID: { key: 'groupId', required: true, type: ValidType.STRING, },
    START_DATE: { key: 'startDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    SERVER_LIMIT: { key: 'serverLimit', required: true, type: ValidType.NUMBER },
    USER_LIMIT: { key: 'userLimit', required: true, type: ValidType.NUMBER },
}

class ReqProductGroupCreate extends Model {
    constructor({ groupId, startDate, endDate, serverLimit, userLimit }) {
        super();
        this[Schema.GROUP_ID.key] = groupId;
        this[Schema.START_DATE.key] = startDate;
        this[Schema.END_DATE.key] = endDate;
        this[Schema.SERVER_LIMIT.key] = serverLimit;
        this[Schema.USER_LIMIT.key] = userLimit;
    }

    getGroupId() {
        return this[Schema.GROUP_ID.key];
    }
}

module.exports = ReqProductGroupCreate;
module.exports.Schema = Schema;