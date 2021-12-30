const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: false, type: ValidType.STRING },
  LANG: { key: "lang", required: false, type: ValidType.STRING },
  UI_NAME: { key: "uiName", required: false, type: ValidType.STRING },
  ETC_DATA: { key: "etcData", required: false, type: ValidType.STRING },
};

class ReqLogUI extends Model {
  constructor({ storyId, lang, uiName, etcData }) {
    super();

    this[Schema.STORY_ID.key] = storyId;
    this[Schema.LANG.key] = lang;
    this[Schema.UI_NAME.key] = uiName;
    this[Schema.ETC_DATA.key] = etcData;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqLogUI;
module.exports.Schema = Schema;
