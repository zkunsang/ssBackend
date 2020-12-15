const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    THUMBNAIL: { key: 'thumbnail', required: false, type: ValidType.STRING },
    THUMBNAIL_CRC32: { key: 'thumbnailCrc32', required: false, type: ValidType.STRING },
    THUMBNAIL_VERSION: { key: 'thumbnailVersion', required: false, type: ValidType.NUMBER },
    TEXTFILE: { key: 'textFile', required: false, type: ValidType.STRING },
    TEXTFILE_CRC32: { key: 'textFileCrc32', required: false, type: ValidType.STRING },
    TEXTFILE_VERSION: { key: 'textFileVersion', required: false, type: ValidType.NUMBER },
    FACE_TAG: { key: 'faceTag', required: true, type: ValidType.STRING },
}

class Story extends Model {
    constructor({ storyId, status, version, thumbnail, thumbnailCrc32, thumbnailVersion, textFile, textFileVersion, textFileCrc32, faceTag }) {
        super();

        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.STATUS.key] = ValidateUtil.setNullUndefined(status);
        this[Schema.VERSION.key] = ValidateUtil.setNullUndefined(version);

        this[Schema.THUMBNAIL.key] = ValidateUtil.setNullUndefined(thumbnail);
        this[Schema.THUMBNAIL_CRC32.key] = ValidateUtil.setNullUndefined(thumbnailCrc32);
        this[Schema.THUMBNAIL_VERSION.key] = ValidateUtil.setNullUndefined(thumbnailVersion);

        this[Schema.TEXTFILE.key] = ValidateUtil.setNullUndefined(textFile);
        this[Schema.TEXTFILE_CRC32.key] = ValidateUtil.setNullUndefined(textFileCrc32);
        this[Schema.TEXTFILE_VERSION.key] = ValidateUtil.setNullUndefined(textFileVersion);

        this[Schema.FACE_TAG.key] = ValidateUtil.setNullUndefined(faceTag);
        
    }

    setVersion(version) {
        this[Schema.VERSION.key] = version;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }

    getStatus() {
        return this[Schema.STATUS.key];
    }

    getThumbnail() {
        return this[Schema.THUMBNAIL.key];
    }

    getThumbnailVersion() {
        return this[Schema.THUMBNAIL_VERSION.key];
    }

    getThumbnailCrc32() {
        return this[Schema.THUMBNAIL_CRC32.key];
    }

    getTextFile() {
        return this[Schema.TEXTFILE.key];
    }

    getTextFileVersion() {
        return this[Schema.TEXTFILE_VERSION.key];
    }

    getTextFileCrc32() {
        return this[Schema.TEXTFILE_CRC32.key];
    }

    getFaceTag() {
        return this[Schema.FACE_TAG.key];
    }
}

module.exports = Story;
module.exports.Schema = Schema;