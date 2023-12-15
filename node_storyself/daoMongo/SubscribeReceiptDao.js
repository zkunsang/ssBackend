const SubscribeReceipt = require("../models/mongo/SubscribeReceipt");
const Dao = require("./Dao");

class SubscribeReceiptDao extends Dao {
  constructor(connection) {
    super();
    this.db = connection.userConnect.db("user");
    this.collection = this.db.collection("subscribe_receipt");
  }

  static model = SubscribeReceipt;

  static requireInsertFieldList() {
    return [
      SubscribeReceipt.Schema.UID.key,
      SubscribeReceipt.Schema.APPSTORE.key,
      SubscribeReceipt.Schema.PRODUCT_ID.key,
      SubscribeReceipt.Schema.PURCHASE_DATE.key,
      SubscribeReceipt.Schema.UPDATE_DATE.key,
    ];
  }

  static allowWhereFieldList() {
    return [
      SubscribeReceipt.Schema.UID.key,
      SubscribeReceipt.Schema.PRODUCT_ID.key,
    ];
  }

  static allowSetFieldList() {
    return [];
  }

  static notAllowSetFieldList() {
    return [];
  }
}

module.exports = SubscribeReceiptDao;
