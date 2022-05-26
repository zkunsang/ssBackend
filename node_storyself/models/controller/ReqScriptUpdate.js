const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
  SIZE: { key: "size", required: true, type: ValidType.NUMBER },

};

class ReqScriptUpdate extends Model {
  constructor({ size, storyId }) {
    super();
    this[Schema.SIZE.key] = size;
    this[Schema.STORY_ID.key] = storyId;
  }
}

module.exports = ReqScriptUpdate;
module.exports.Schema = Schema;
