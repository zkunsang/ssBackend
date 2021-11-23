const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
  SCENE_INDEX: { key: "sceneIndex", required: true, type: ValidType.NUMBER },
  STICKER_ID: { key: "stickerId", required: false, type: ValidType.STRING },
  ITEM_ID: { key: "itemId", required: true, type: ValidType.STRING },
  X: { key: "x", required: true, type: ValidType.NUMBER },
  Y: { key: "y", required: true, type: ValidType.NUMBER },
  ROT: { key: "rot", required: true, type: ValidType.NUMBER },
  SCALE_X: { key: "scaleX", required: true, type: ValidType.NUMBER },
  SCALE_Y: { key: "scaleY", required: true, type: ValidType.NUMBER },
  DEPTH: { key: "depth", required: true, type: ValidType.NUMBER },
  PARENT_ID: { key: "parentId", required: true, type: ValidType.STRING },
};

class ReqStickerAttach extends Model {
  constructor({
    storyId,
    sceneIndex,
    itemId,
    stickerId,
    x,
    y,
    rot,
    scaleX,
    scaleY,
    depth,
    parentId,
  }) {
    super();

    this[Schema.STORY_ID.key] = storyId;
    this[Schema.SCENE_INDEX.key] = sceneIndex;
    this[Schema.ITEM_ID.key] = itemId;
    this[Schema.STICKER_ID.key] = stickerId;
    this[Schema.X.key] = x;
    this[Schema.Y.key] = y;
    this[Schema.ROT.key] = rot;
    this[Schema.SCALE_X.key] = scaleX;
    this[Schema.SCALE_Y.key] = scaleY;
    this[Schema.DEPTH.key] = depth;
    this[Schema.PARENT_ID.key] = parentId;
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }

  getSceneIndex() {
    return this[Schema.SCENE_INDEX.key];
  }

  getStickerId() {
    return this[Schema.STICKER_ID.key];
  }

  getItemId() {
    return this[Schema.ITEM_ID.key];
  }
}

module.exports = ReqStickerAttach;
module.exports.Schema = Schema;
