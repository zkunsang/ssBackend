const UserResource = require('../models/mongo/UserResource');
const Dao = require('./Dao');

class UserResourceDao extends Dao {
  constructor(connection) {
    super();
    this.db = connection.userConnect.db('user');
    this.collection = this.db.collection('user_resource');
  }

  static model = UserResource;

  static requireInsertFieldList() {
    return [
      UserResource.Schema.UID.key,
      UserResource.Schema.MODEL.key,
      UserResource.Schema.RECORD.key,

    ];
  }

  static allowWhereFieldList() {
    return [
      UserResource.Schema.UID.key,
    ];
  }

  static allowSetFieldList() {
    return [
      UserResource.Schema.MODEL.key,
      UserResource.Schema.RECORD.key
    ]
  };

  static notAllowSetFieldList() {
    return [
      UserResource.Schema.UID.key,

    ]
  };
}

module.exports = UserResourceDao;