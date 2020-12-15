const shortid = require('shortid');
const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedisSS');
const CmsSessionDao = require('@ss/daoRedis/CmsSessionDao');
const AdminDao = require('@ss/daoMongo/AdminDao');
const ReqAuthLogin = require('@ss/models/cmsController/ReqAuthLogin');

module.exports = async (ctx, next) => {
    const cmsSessionDao = new CmsSessionDao(dbRedis);
    const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
    ReqAuthLogin.validModel(reqAuthLogin);

    const adminDao = new AdminDao(dbMongo);
    const adminInfo = await adminDao.findOne({ adminId: reqAuthLogin.getAdminId() });

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