const Model = require("../../");

const ValidateUtil = require('../../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    REASON_ID: { key: 'reasonId', require: true, type: ValidType.NUMBER },
    REASON_TEXT: { key: 'reasonText', required: true, type: ValidType.STRING },
}

class ReqUserDelete extends Model {
  constructor({reasonId, reasonText}) {
    super();

    this[Schema.REASON_ID.key] = reasonId;
    this[Schema.REASON_TEXT.key] = reasonText;
  }
}

module.exports = ReqUserDelete;