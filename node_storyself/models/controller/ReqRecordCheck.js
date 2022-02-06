const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
};

class ReqRecordCheck extends Model {
  constructor({ storyId }) {
    super();
    this[Schema.STORY_ID.key] = storyId;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqRecordCheck;
module.exports.Schema = Schema;
