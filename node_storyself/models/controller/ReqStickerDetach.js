const Model = require("../../models");

const ValidateUtil = require("../../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Schema = {
  STICKER_IDS: { key: "stickerIds", required: true, type: ValidType.ARRAY },
};

class ReqStickerDetach extends Model {
  constructor({ stickerIds }) {
    super();

    this[Schema.STICKER_IDS.key] = stickerIds;
  }

  getStickerIds() {
    return this[Schema.STICKER_IDS.key];
  }
}

module.exports = ReqStickerDetach;
module.exports.Schema = Schema;
