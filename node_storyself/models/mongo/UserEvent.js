const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    EVENT_INFO: { key: 'eventInfo', required: true, type: ValidType.OBJECT },
}

class UserEvent extends Model {
    constructor({ uid, eventInfo }) {
        super();

        this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
        this[Schema.EVENT_INFO.key] = ValidateUtil.setNullUndefined(eventInfo);
    }
}

module.exports = UserEvent;
module.exports.Schema = Schema;