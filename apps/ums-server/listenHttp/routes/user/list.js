const dbMongo = require('@ss/dbMongo');
const UserDao = require('@ss/daoMongo/UserDao');
const ReqUserList = require('@ss/models/umsController/ReqUserList');
const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(userList) {
    for(const userInfo of userList) {
        DateUtil.utsToDsObj(userInfo, 'lastLoginDate');
        DateUtil.utsToDsObj(userInfo, 'createDate');
    }
}

module.exports = async (ctx, next) => {
    const reqAuthLogin = new ReqUserList(ctx.request.body);
    ReqUserList.validModel(reqAuthLogin);

    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findAll();

    utsToDsObj(userList);

    ctx.status = 200;
    ctx.body.data = { userList };

    console.log(userList);

    await next();
};