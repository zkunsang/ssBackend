const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const CommonBoolean = ValidateUtil.CommonBoolean;

const Schema = {
    START_DATE: { key: 'startDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    MESSAGE: { key: 'message', required: true, type: ValidType.STRING},
    STATUS: { key: 'status', required: true, type:ValidType.NUMBER, validRange:Object.values(CommonBoolean)},
    CODE: { key: 'code', required: false, type:ValidType.NUMBER}
}

class ReqServerStatusCreate extends Model{
    constructor({ startDate, endDate, message, status, code }) {
        super();
        this[Schema.START_DATE.key] = startDate;
        this[Schema.END_DATE.key] = endDate;
        this[Schema.MESSAGE.key] = message;
        this[Schema.STATUS.key] = status;
        this[Schema.CODE.key] = code;
    }

    getStartDate() {
        return this[Schema.START_DATE.key];
    }

    getEndDate() {
        return this[Schema.END_DATE.key];
    }

    getMessage() {
        return this[Schema.MESSAGE.key];
    }

    getStatus() {
        return this[Schema.STATUS.key];
    }

    getCode() {
        return this[Schema.CODE.key];
    }
}

module.exports = ReqServerStatusCreate;
module.exports.Schema = Schema;