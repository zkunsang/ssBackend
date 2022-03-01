const ProductKey = require("../models/mongo/ProductKey");
const Dao = require('./Dao');

class ProductKeyDao extends Dao {
  constructor(connection) {
    super();
    this.db = connection.logConnect.db('user');
    this.collection = this.db.collection('productKey');
  }

  static model = ProductKey;

  static requireInsertFieldList() {
    return [];
  }

  static allowWhereFieldList() {
    return [];
  }

  static allowSetFieldList() {
    return [ProductKey.Schema.PRODUCT_KEYS.key]
  };

  static notAllowSetFieldList() {
    return []
  };
}

module.exports = ProductKeyDao;