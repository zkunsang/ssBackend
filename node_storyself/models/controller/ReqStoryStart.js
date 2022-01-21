const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
  FACE_LIST: { key: 'faceList', required: false, type: ValidType.ARRAY },
  ITEM_LIST: { key: 'itemList', required: false, type: ValidType.ARRAY },
  IS_FREE: { key: 'isFree', required: false, type: ValidType.BOOLEAN },
}

class ReqStoryStart extends Model {
  constructor({ storyId, faceList, itemList, isFree }) {
    super();

    this[Schema.STORY_ID.key] = storyId;
    this[Schema.FACE_LIST.key] = faceList;
    this[Schema.ITEM_LIST.key] = itemList;
    this[Schema.IS_FREE.key] = isFree;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }

  getItemList() {
    return this[Schema.ITEM_LIST.key];
  }

  getFaceList() {
    return this[Schema.FACE_LIST.key];
  }

  getIsFree() {
    return this[Schema.IS_FREE.key] || true;
  }
}

module.exports = ReqStoryStart;
module.exports.Schema = Schema;