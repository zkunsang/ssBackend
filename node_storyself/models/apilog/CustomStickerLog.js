const DateUtil = require("../../util/DateUtil");
const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: "uid", required: false, type: ValidType.STRING },
  CONTENTS_ID: { key: "contentsId", required: false, type: ValidType.NUMBER },
  CONTENTS_COUNT: { key: "contentsCount", required: false, type: ValidType.NUMBER },
};

class CustomStickerLog extends Model {
  constructor({ uid, contentsId, contentsCount, logDate }) {
    super();
    this[Schema.UID.key] = uid;
    this[Schema.CONTENTS_ID.key] = contentsId;
    this[Schema.CONTENTS_COUNT.key] = contentsCount;

    this.logDateTZ = DateUtil.utsToDs(logDate);
  }
}

module.exports = CustomStickerLog;
module.exports.Schema = Schema;
