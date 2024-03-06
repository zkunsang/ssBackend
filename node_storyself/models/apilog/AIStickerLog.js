const Model = require('..')

const ValidateUtil = require('../../util/ValidateUtil')
const DateUtil = require('../../util/DateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: false, type: ValidType.STRING },
    PROMPT: { key: 'prompt', required: false, type: ValidType.STRING },
    KEYWORD: { key: 'keyword', required: false, type: ValidType.STRING },
    LAST_KEYWORD: { key: 'lastKeyword', required: false, type: ValidType.STRING }
}

class AIStickerLog extends Model {
    constructor(
        { uid, prompt, keyword, lastKeyword, fileName, seedId, mode, language }, logDate) {
        super();
        
        this.uid = uid;
        this.prompt = prompt;
        this.keyword = keyword;
        this.lastKeyword = lastKeyword;
        this.loginDateTZ = DateUtil.utsToDs(logDate);
        this.fileName = fileName;
        this.seedId = seedId;
        this.mode = mode;
        this.language = language;
    }
}

module.exports = AIStickerLog;
module.exports.Schema = Schema;