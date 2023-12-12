const Model = require('../..');

const ValidateUtil = require('../../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// TODO: file prefix 정의하기
const Schema = {
    PROMPT: { key: 'prompt', required: true, type: ValidType.STRING }
}

class ReqAIGenerate extends Model {
    constructor({ prompt }) {
        super();

        this[Schema.PROMPT.key] = prompt;
    }

    getPrompt() {
        return this[Schema.PROMPT.key]
    }
}

module.exports = ReqAIGenerate;
module.exports.Schema = Schema;