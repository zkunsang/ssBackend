const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  UID: { key: 'uid', required: true, type: ValidType.STRING },
  RECORD: { key: 'record', required: false, type: ValidType.OBJECT },
  MODEL: { key: 'model', required: false, type: ValidType.OBJECT },
  SCRIPT: { key: 'script', required: false, type: ValidType.OBJECT },
  CUSTOM_STICKER: { key: 'customsticker', required: false, type: ValidType.OBJECT },
}

class UserResource extends Model {
  constructor({ uid, record, model, script, customsticker }) {
    super();

    this[Schema.UID.key] = ValidateUtil.setNullUndefined(uid);
    this[Schema.RECORD.key] = ValidateUtil.setNullUndefined(record);
    this[Schema.MODEL.key] = ValidateUtil.setNullUndefined(model);
    this[Schema.SCRIPT.key] = ValidateUtil.setNullUndefined(script);
    this[Schema.CUSTOM_STICKER.key] = ValidateUtil.setNullUndefined(customsticker);
  }

  getModel() {
    return this[Schema.MODEL.key];
  }

  getRecord() {
    return this[Schema.RECORD.key];
  }

  getScript() {
    return this[Schema.SCRIPT.key];
  }


};

module.exports = UserResource;
module.exports.Schema = Schema;
