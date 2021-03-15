const dbMongo = require('@ss/dbMongo');
const UserDao = require('@ss/daoMongo/UserDao');
const ReqUserInfo = require('@ss/models/umsController/ReqUserInfo');
const DateUtil = require('@ss/util/DateUtil');

module.exports = async (ctx, next) => {
    const reqUserInfo = new ReqUserInfo(ctx.request.body);
    ReqUserInfo.validModel(reqUserInfo);

    const uid = reqUserInfo.getUid();

    const userDao = new UserDao(dbMongo);
    const userInfo = await userDao.findOne({uid});

    ctx.$res.setResultCode(0);
    ctx.$res.success({ userInfo });
    
    await next();
};