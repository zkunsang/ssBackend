const DateUtil = require("../../util/DateUtil");
const CustomStickerLog = require("../../models/apilog/CustomStickerLog");
const Dao = require("../Dao");

class CustomStickerLogDao extends Dao {
  constructor(connection, date) {
    super();
    this.db = connection.logConnect.db("log");
    this.collection = this.db.collection(
      `customsticker_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`
    );
  }

  static model = CustomStickerLog;

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

module.exports = CustomStickerLogDao;