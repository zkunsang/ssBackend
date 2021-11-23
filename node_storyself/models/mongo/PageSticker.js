const Model = require("..");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  ITEM_ID: { key: "itemId", required: true, type: ValidType.STRING },
  STORY_ID: { key: "storyId", required: true, type: ValidType.STRING },
  SCENE_INDEX: { key: "sceneIndex", required: true, type: ValidType.NUMBER },
  STICKER_ID: { key: "stickerId", required: true, type: ValidType.STRING },
  X: { key: "x", required: true, type: ValidType.NUMBER },
  Y: { key: "y", required: true, type: ValidType.NUMBER },
  ROT: { key: "rot", required: true, type: ValidType.NUMBER },
  SCALE_X: { key: "scaleX", required: true, type: ValidType.NUMBER },
  SCALE_Y: { key: "scaleY", required: true, type: ValidType.NUMBER },
  DEPTH: { key: "depth", required: true, type: ValidType.NUMBER },
  PARENT_ID: { key: "parentId", required: true, type: ValidType.STRING },
};

class PageSticker extends Model {
  constructor({
    itemId,
    storyId,
    sceneIndex,
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

    this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
    this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
    this[Schema.SCENE_INDEX.key] = ValidateUtil.setNullUndefined(sceneIndex);
    this[Schema.STICKER_ID.key] = ValidateUtil.setNullUndefined(stickerId);
    this[Schema.X.key] = ValidateUtil.setNullUndefined(x);
    this[Schema.Y.key] = ValidateUtil.setNullUndefined(y);
    this[Schema.ROT.key] = ValidateUtil.setNullUndefined(rot);
    this[Schema.SCALE_X.key] = ValidateUtil.setNullUndefined(scaleX);
    this[Schema.SCALE_Y.key] = ValidateUtil.setNullUndefined(scaleY);
    this[Schema.DEPTH.key] = ValidateUtil.setNullUndefined(depth);
    this[Schema.PARENT_ID.key] = ValidateUtil.setNullUndefined(parentId);
  }

  getItemId() {
    return this[Schema.ITEM_ID.key];
  }

  update({ x, y, rot, scaleX, scaleY, depth, parentId }) {
    this[Schema.X.key] = ValidateUtil.setNullUndefined(x);
    this[Schema.Y.key] = ValidateUtil.setNullUndefined(y);
    this[Schema.ROT.key] = ValidateUtil.setNullUndefined(rot);
    this[Schema.SCALE_X.key] = ValidateUtil.setNullUndefined(scaleX);
    this[Schema.SCALE_Y.key] = ValidateUtil.setNullUndefined(scaleY);
    this[Schema.DEPTH.key] = ValidateUtil.setNullUndefined(depth);
    this[Schema.PARENT_ID.key] = ValidateUtil.setNullUndefined(parentId);
  }
}

module.exports = PageSticker;
module.exports.Schema = Schema;
