const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// TODO: file prefix 정의하기
const Schema = {
    PROMPT: { key: 'prompt', required: true, type: ValidType.STRING },
    LANGUAGE: { key: 'language', required: true, type: ValidType.STRING }
}

class ReqAIGenerate extends Model {
    constructor({ prompt, language }) {
        super();

        this[Schema.PROMPT.key] = prompt;
        this[Schema.LANGUAGE.key] = language;
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