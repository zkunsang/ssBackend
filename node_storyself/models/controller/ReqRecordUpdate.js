const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
  RECORD_LIST: { key: 'recordList', required: true, type: ValidType.ARRAY },
  STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
}

class ReqRecordUpdate extends Model {
  constructor({ recordList, storyId }) {
    super();
    this[Schema.RECORD_LIST.key] = recordList;
    this[Schema.STORY_ID.key] = storyId;
  }

  getRecordList() {
    return this[Schema.RECORD_LIST.key];
  }

  getStoryId() {
    return this[Schema.STORY_ID.key];
  }
}

module.exports = ReqRecordUpdate;
module.exports.Schema = Schema;