const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// TODO: file prefix 정의하기
const Schema = {
    PROMPT: { key: 'prompt', required: true, type: ValidType.STRING },
    LANGUAGE: { key: 'language', required: true, type: ValidType.STRING },
    KEYWORD: { key: 'keyword', required: true, type: ValidType.STRING }
}

class ReqAIGenerate extends Model {
    constructor({ prompt, language, keyword }) {
        super();

        this[Schema.PROMPT.key] = prompt;
        this[Schema.LANGUAGE.key] = language;
        this[Schema.KEYWORD.key] = keyword;
    }

    getKeyword() {
        return this[Schema.KEYWORD.key];
    }

    getPrompt() {
        return this[Schema.PROMPT.key];
    }

    getLanguage() {
        return this[Schema.LANGUAGE.key];
    }
}

module.exports = ReqAIGenerate;
module.exports.Schema = Schema;