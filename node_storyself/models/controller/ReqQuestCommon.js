const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: false, type: ValidType.STRING },
  QUEST_IDS: { key: "questIds", required: false, type: ValidType.ARRAY },
};

class ReqQuestCommon extends Model {
  constructor({ storyId, questIds }) {
    super();

    this[Schema.STORY_ID.key] = storyId;
    this[Schema.QUEST_IDS.key] = questIds;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }

  getQuestIds() {
    return this[Schema.QUEST_IDS.key];
  }
}

module.exports = ReqQuestCommon;
module.exports.Schema = Schema;
