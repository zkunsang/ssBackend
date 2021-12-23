const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
  Q_ID: { key: "qId", required: true, type: ValidType.STRING },
};

class ReqCheatDeleteMission extends Model {
  constructor({ storyId, qId }) {
    super();
    this[Schema.STORY_ID.key] = storyId;
    this[Schema.Q_ID.key] = qId;
  }
}

module.exports = ReqCheatDeleteMission;
module.exports.Schema = Schema;
