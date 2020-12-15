const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    THUMBNAIL: { key: 'thumbnail', required: false, type: ValidType.STRING },
    THUMBNAIL_CRC32: { key: 'thumbnailCrc32', required: false, type: ValidType.STRING },
    THUMBNAIL_VERSION: { key: 'thumbnailVersion', required: false, type: ValidType.NUMBER },
    TEXTFILE: { key: 'textFile', required: false, type: ValidType.STRING },
    TEXTFILE_CRC32: { key: 'textFileCrc32', required: false, type: ValidType.STRING },
    TEXTFILE_VERSION: { key: 'textFileVersion', required: false, type: ValidType.NUMBER },
    FACE_TAG: { key: 'faceTag', required: true, type: ValidType.STRING },
}

class ReqStoryCreate extends Model {
    constructor({ storyId, status, thumbnail, thumbnailCrc32, thumbnailVersion, textFile, textFileCrc32, textFileVersion, faceTag}) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.STATUS.key] = status;

        this[Schema.THUMBNAIL.key] = thumbnail;
        this[Schema.THUMBNAIL_CRC32.key] = thumbnailCrc32;
        this[Schema.THUMBNAIL_VERSION.key] = thumbnailVersion;

        this[Schema.TEXTFILE.key] = textFile;
        this[Schema.TEXTFILE_CRC32.key] = textFileCrc32;
        this[Schema.TEXTFILE_VERSION.key] = textFileVersion;

        this[Schema.FACE_TAG.key] = faceTag;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqStoryCreate;
module.exports.Schema = Schema;