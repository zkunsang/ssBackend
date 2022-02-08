const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UPDATE_LIST: { key: "updateList", required: true, type: ValidType.ARRAY },
  DELETE_LIST: { key: "deleteList", required: true, type: ValidType.ARRAY }
};

class ReqModelUpdate extends Model {
  constructor({ updateList, deleteList }) {
    super();
    this[Schema.UPDATE_LIST.key] = updateList;
    this[Schema.DELETE_LIST.key] = deleteList;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqModelUpdate;
module.exports.Schema = Schema;
