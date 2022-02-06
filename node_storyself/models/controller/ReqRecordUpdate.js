const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UPDATE_LIST: { key: "updateList", required: true, type: ValidType.ARRAY },
  DELETE_LIST: { key: "deleteList", required: true, type: ValidType.ARRAY },
  RESET_ALL: { key: "resetAll", required: true, type: ValidType.ARRAY },
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
};

class ReqRecordUpdate extends Model {
  constructor({ updateList, deleteList, resetAll, storyId }) {
    super();
    this[Schema.UPDATE_LIST.key] = updateList;
    this[Schema.DELETE_LIST.key] = deleteList;
    this[Schema.RESET_ALL.key] = resetAll;
    this[Schema.STORY_ID.key] = storyId;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqRecordUpdate;
module.exports.Schema = Schema;
