const DateUtil = require("../../util/DateUtil");
const StreamingLog = require("../../models/apilog/StreamingLog");
const Dao = require("../Dao");

class StreamingLogDao extends Dao {
  constructor(connection, date) {
    super();
    this.db = connection.logConnect.db("log");
    this.collection = this.db.collection(
      `streaming_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`
    );
  }

  static model = StreamingLog;

  static requireInsertFieldList() {
    return [];
  }

  static allowWhereFieldList() {
    return [];
  }

  static allowSetFieldList() {
    return [];
  }

  static notAllowSetFieldList() {
    return [];
  }
}

module.exports = StreamingLogDao;