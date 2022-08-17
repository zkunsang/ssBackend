const DateUtil = require("../../util/DateUtil");
const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: "uid", required: false, type: ValidType.STRING },
  REASON_ID: { key: "reasonId", required: false, type: ValidType.NUMBER },
  REASON_TEXT: { key: "reasonText", required: false, type: ValidType.STRING },
  LOG_DATE: { key: "logDate", required: false, type: ValidType.UNIX_TIMESTAMP },
};

class UserDeleteLog extends Model {
  constructor({ uid, reasonId, reasonText, logDate }) {
    super();
    this[Schema.UID.key] = uid;
    this[Schema.REASON_ID.key] = reasonId;
    this[Schema.REASON_TEXT.key] = reasonText;
    this[Schema.LOG_DATE.key] = logDate;

    this.logDateTZ = DateUtil.utsToDs(logDate);
  }
}

module.exports = UserDeleteLog;
module.exports.Schema = Schema;
