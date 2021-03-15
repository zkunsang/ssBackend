const dbMongo = require('@ss/dbMongo');
const UserDao = require('@ss/daoMongo/UserDao');
const ReqUserSearch = require('@ss/models/umsController/ReqUserSearch');

module.exports = async (ctx, next) => {
    const reqAuthLogin = new ReqUserSearch(ctx.request.body);
    ReqUserSearch.validModel(reqAuthLogin);

    const email = reqAuthLogin.getEmail();

    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findMany({email});

    ctx.$res.setResultCode(0);
    ctx.$res.success({ userList });
    
    await next();
};