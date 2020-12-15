const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    POLICY_VERSION: { key: 'policyVersion', required: true, type: ValidType.STRING }
}

class ReqUserPolicy extends Model {
    constructor({ policyVersion }) {
        super();
        this[Schema.POLICY_VERSION.key] = policyVersion;
    }

    getPolicyVersion() {
        return this[Schema.POLICY_VERSION.key];
    }
}

module.exports = ReqUserPolicy;
module.exports.Schema = Schema;
