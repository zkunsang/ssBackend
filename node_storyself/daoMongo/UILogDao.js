const DateUtil = require("../util/DateUtil");
const UILog = require("../models/apilog/UILog");
const Dao = require("./Dao");

class SceneLogDao extends Dao {
  constructor(connection, date) {
    super();
    this.db = connection.logConnect.db("log");
    this.collection = this.db.collection(
      `ui_${DateUtil.utsToDs(date, DateUtil.YYYYMMDD)}`
    );
  }

  static model = UILog;

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

module.exports = SceneLogDao;
