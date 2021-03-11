const shortid = require('shortid');
const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedisSS');
const SSError = require('@ss/error');
const UmsSessionDao = require('@ss/daoRedis/UmsSessionDao');
const UmsAdminDao = require('@ss/daoMongo/UmsAdminDao');
const ReqAuthLogin = require('@ss/models/umsController/ReqAuthLogin');

module.exports = async (ctx, next) => {
    const umsSessionDao = new UmsSessionDao(dbRedis);
    const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
    ReqAuthLogin.validModel(reqAuthLogin);

    const umsAdminDao = new UmsAdminDao(dbMongo);
    const adminInfo = await umsAdminDao.findOne({ adminId: reqAuthLogin.getAdminId() });

    if (!adminInfo || adminInfo.password !== reqAuthLogin.getPassword()) {
        ctx.$res.badRequest(SSError.UmsService.Code.loginFailed)
        return await next();
    }

    const sessionId = shortid.generate();
    umsSessionDao.set(sessionId, adminInfo);

    ctx.$res.success({ sessionId, adminId: adminInfo.getAdminId() });

    await next();
};