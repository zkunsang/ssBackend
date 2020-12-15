const shortid = require('shortid');
const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedisSS');
const UmsSessionDao = require('@ss/daoRedis/UmsSessionDao');
const UmsAdminDao = require('@ss/daoMongo/UmsAdminDao');
const ReqAuthLogin = require('@ss/models/umsController/ReqAuthLogin');

module.exports = async (ctx, next) => {
    const cmsSessionDao = new UmsSessionDao(dbRedis);
    const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
    ReqAuthLogin.validModel(reqAuthLogin);

    const umsAdminDao = new UmsAdminDao(dbMongo);
    const adminInfo = await umsAdminDao.findOne({ adminId: reqAuthLogin.getAdminId() });

    if (!adminInfo || adminInfo.password !== reqAuthLogin.getPassword()) {
        ctx.status = 400;
        ctx.body.data = { err_message: 'invalid user or not match password!' };
        return await next();
    }

    const sessionId = shortid.generate();
    cmsSessionDao.set(sessionId, adminInfo);

    ctx.status = 200;
    ctx.body.data = { sessionId, adminId: adminInfo.getAdminId() };


    await next();
};