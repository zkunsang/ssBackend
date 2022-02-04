const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: 'uid', required: true, type: ValidType.STRING },
  RECORD: { key: 'record', required: false, type: ValidType.OBJECT },
  MODEL: { key: 'model', required: false, type: ValidType.OBJECT },
}

class UserResource extends Model {
  constructor({ uid, record, model }) {
    super();

    this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
    this[Schema.RECORD.key] = ValidateUtil.setNullUndefined(record);
    this[Schema.MODEL.key] = ValidateUtil.setNullUndefined(model);
  }

  getModel() {
    return this[Schema.MODEL.key];
  }

  getRecord() {
    return this[Schema.RECORD.key];
  }


};

module.exports = UserResource;
module.exports.Schema = Schema;
