const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PUSH_TYPE: { key: 'pushType', required: true, type: ValidType.NUMBER }, 
    BODY: { key: 'body', required: true, type: ValidType.STRING },
    TITLE: { key: 'title', required: true, type: ValidType.STRING },
    UID: { key: 'uid', required: false, type: ValidType.STRING },
}

class ReqAuthLogin extends Model {
    constructor({ pushType, body, title, uid }) {
        super();
        
        this[Schema.UID.key] = uid;
        this[Schema.PUSH_TYPE.key] = pushType;
        this[Schema.BODY.key] = body;
        this[Schema.TITLE.key] = title;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getPushType() {
        return this[Schema.PUSH_TYPE.key];
    }
}

module.exports = ReqAuthLogin;
module.exports.Schema = Schema;