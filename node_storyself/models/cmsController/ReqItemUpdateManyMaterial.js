const Model = require('../../models')

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    MATERIAL_LIST: { key: 'materialList', required: true, type: ValidType.ARRAY }
}

class ReqItemUpdateManyMaterial extends Model {
    constructor({ materialList }) {
        super();
        this[Schema.MATERIAL_LIST.key] = materialList;
    }

    getMaterialList() {
        return this[Schema.MATERIAL_LIST.key];
    }
}

module.exports = ReqItemUpdateManyMaterial;
module.exports.Schema = Schema;