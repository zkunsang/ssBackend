const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    GROUP_ID: { key: 'groupId', required: true, type: ValidType.STRING, },
}

class ReqProductGroupDelete extends Model {
    constructor({ groupId }) {
        super();
        this[Schema.GROUP_ID.key] = groupId;
    }

    getGroupId() {
        return this[Schema.GROUP_ID.key];
    }
}

module.exports = ReqProductGroupDelete;
module.exports.Schema = Schema;