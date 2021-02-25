const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: false, type: ValidType.STRING },
    SCENE_INDEX: { key: 'sceneIndex', required: false, type: ValidType.NUMBER },
    SOUND_INDEX: { key: 'soundIndex', required: false, type: ValidType.NUMBER },
    LENGTH: { key: 'length', required: false, type: ValidType.NUMBER },
}

class ReqLogVoice extends Model {
    constructor({ storyId, sceneIndex, soundIndex, length }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.SCENE_INDEX.key] = sceneIndex;
        this[Schema.SOUND_INDEX.key] = soundIndex;
        this[Schema.LENGTH.key] = length;
    }
    
    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getSceneIndex() {
        return this[Schema.SCENE_INDEX.key];
    }

    getSoundIndex() {
        return this[Schema.SOUND_INDEX.key];
    }

    getLength() {
        return this[Schema.LENGTH.key];
    }
}

module.exports = ReqLogVoice;
module.exports.Schema = Schema;