const ValidateUtil = require('@ss/util/ValidateUtil');
const Model = require('../../models')

const ValidType = ValidateUtil.ValidType;

const Schema = {
    EMAIL: { key: 'email', required: true, type: ValidType.STRING },
}

class ReqUserSearch extends Model {
    constructor({email}) {
        super();

        this[Schema.EMAIL.key] = email;
    }

    getEmail() {
        return this[Schema.EMAIL.key];
    }
}

module.exports = ReqUserSearch;
module.exports.Schema = Schema;