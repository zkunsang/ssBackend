const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: false, type: ValidType.STRING },
};

class ReqCommonData extends Model {
  constructor({ storyId }) {
    super();
    this[Schema.STORY_ID.key] = storyId;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqCommonData;
module.exports.Schema = Schema;
