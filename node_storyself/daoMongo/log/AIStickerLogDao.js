const DateUtil = require("../../util/DateUtil");
const AIStickerLog = require("../../models/apilog/AIStickerLog");
const Dao = require("../Dao");

class AIStickerLogDao extends Dao {
  constructor(connection, date) {
    super();
    this.db = connection.logConnect.db("log");
    this.collection = this.db.collection(
      `ai_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`
    );
  }

  static model = AIStickerLog;

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

module.exports = AIStickerLogDao;