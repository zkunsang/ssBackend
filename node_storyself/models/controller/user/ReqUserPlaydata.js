const Model = require("../../");

const ValidateUtil = require("../../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  SIZE: { key: "size", required: false, type: ValidType.NUMBER },
};

class ReqUserPlaydata extends Model {
  constructor({ size }) {
    super();

    this[Schema.SIZE.key] = ValidateUtil.setNullUndefined(size);
    
  }
}

module.exports = ReqUserPlaydata;
module.exports.Schema = Schema;
