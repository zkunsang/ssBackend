const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    RESOURCE_LIST: { key: 'resourceList', required: true, type: ValidType.ARRAY },
}

class ReqResourceUpdateMany extends Model {
    constructor({ resourceList }) {
        super();
        this[Schema.RESOURCE_LIST.key] = resourceList;
    }

    getResourceList() {
        return this[Schema.RESOURCE_LIST.key];
    }
}

module.exports = ReqResourceUpdateMany;
module.exports.Schema = Schema;