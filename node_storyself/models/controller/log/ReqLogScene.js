const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    LANG: { key: 'lang', required: false, type: ValidType.STRING },
    SCENE_INDEX: { key: 'sceneIndex', required: false, type: ValidType.NUMBER },
    ELAPSED_TIME: { key: 'elapsedTime', required: false, type: ValidType.NUMBER },
}

class ReqLogScene extends Model {
    constructor({ storyId, sceneIndex, lang, elapsedTime }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.LANG.key] = lang;
        this[Schema.SCENE_INDEX.key] = sceneIndex;
        this[Schema.ELAPSED_TIME.key] = elapsedTime;
    }
}

module.exports = ReqLogScene;
module.exports.Schema = Schema;