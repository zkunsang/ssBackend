const UserDao = require('../../node_storyself/daoMongo/UserDao');
const dbMongo = require('../../node_storyself/dbMongo');

class UserTestUtil {
    constructor() {
        this.userDao = new UserDao(dbMongo);
    }

    async findAndDeleteUser(provider, providerId) {
        const where = {
            [provider]: providerId
        }
        const userInfo = await this.userDao.findOne(where);
        if (userInfo) { await this.userDao.deleteOne(where); }

    }
}

module.exports = UserTestUtil;