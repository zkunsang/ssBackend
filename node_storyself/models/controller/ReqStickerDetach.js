const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STICKER_ID: { key: 'stickerId', required: true, type: ValidType.STRING }
}


class ReqStickerDetach extends Model {
    constructor({ stickerId }) {
        super();

        this[Schema.STICKER_ID.key] = stickerId;
    }

    getStickerId() {
        return this[Schema.STICKER_ID.key];
    }
}

module.exports = ReqStickerDetach;
module.exports.Schema = Schema;