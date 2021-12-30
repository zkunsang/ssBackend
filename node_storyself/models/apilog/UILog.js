const DateUtil = require("../../util/DateUtil");
const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: "uid", required: false, type: ValidType.STRING },
  STORY_ID: { key: "storyId", required: false, type: ValidType.STRING },
  LANG: { key: "lang", required: false, type: ValidType.STRING },
  UI_NAME: { key: "uiName", required: false, type: ValidType.STRING },
  ETC_DATA: { key: "etcData", required: false, type: ValidType.STRING },
  LOG_DATE: { key: "logDate", required: false, type: ValidType.UNIX_TIMESTAMP },
};

class UILog extends Model {
  constructor({ uid, storyId, lang, uiName, etcData, logDate }) {
    super();
    this[Schema.UID.key] = uid;
    this[Schema.STORY_ID.key] = storyId;
    this[Schema.LANG.key] = lang;
    this[Schema.UI_NAME.key] = uiName;
    this[Schema.ETC_DATA.key] = etcData;
    this[Schema.LOG_DATE.key] = logDate;

    this.logDateTZ = DateUtil.utsToDs(logDate);
  }
}

module.exports = UILog;
module.exports.Schema = Schema;
