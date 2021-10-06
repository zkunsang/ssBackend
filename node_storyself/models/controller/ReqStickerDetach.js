const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    SCENE_INDEX: { key: 'sceneIndex', required: true, type: ValidType.NUMBER },
    STICKER_ID: { key: 'stickerId', required: true, type: ValidType.STRING }
}


class ReqStickerDetach extends Model {
    constructor({ storyId, sceneIndex, stickerId }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.SCENE_INDEX.key] = sceneIndex;
        this[Schema.STICKER_ID.key] = stickerId;
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
}

module.exports = ReqStickerDetach;
module.exports.Schema = Schema;