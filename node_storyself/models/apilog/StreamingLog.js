const DateUtil = require("../../util/DateUtil");
const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: "uid", required: false, type: ValidType.STRING },
  ID: { key: "id", required: false, type: ValidType.STRING },
  END_TYPE: { key: "endType", required: false, type: ValidType.NUMBER },
  ELAPSED_TIME: { key: "elapsedTime", required: false, type: ValidType.NUMBER },
};

class StreamingLog extends Model {
  constructor({ uid, id, endType, elapsedTime, logDate }) {
    super();
    this[Schema.UID.key] = uid;
    this[Schema.ID.key] = id;
    this[Schema.END_TYPE.key] = endType;
    this[Schema.ELAPSED_TIME.key] = elapsedTime;

    this.logDateTZ = DateUtil.utsToDs(logDate);
  }
}

module.exports = StreamingLog;
module.exports.Schema = Schema;