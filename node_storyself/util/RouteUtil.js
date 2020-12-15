const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedisSS');

const ReqSession = require('@ss/models/cmsController/ReqSession');
const CmsSessionDao = require('@ss/daoRedis/CmsSessionDao');
const UmsSessionDao = require('@ss/daoRedis/UmsSessionDao')

const Admin = require('@ss/models/mongo/Admin');
const AdminDao = require('@ss/daoMongo/AdminDao');
const UmsAdminDao = require('@ss/daoMongo/UmsAdminDao');

async function sessionError(ctx, next) {
    ctx.status = 401;
    ctx.body.data = { err_message: 'session not ' };
}

async function commonAuthCheck(ctx, next) {
    try {
        const service = process.env.NODE_ENV;
        const isCms = service.startsWith("cms");
        
        const adminDaoModel = isCms ? AdminDao : UmsAdminDao;
        const sessionDaoModel = isCms ? CmsSessionDao : UmsSessionDao;

        await authCheck(ctx, next, adminDaoModel, sessionDaoModel);
    }
    catch(err) {
        console.error(err);
    }
}

async function authCheck(ctx, next, AdminDaoModel, SessionDaoModel) {
    try {
        const reqSession = new ReqSession(ctx.request.body);
        ReqSession.validModel(reqSession);

        const cmsSessionDao = new SessionDaoModel(dbRedis);
        const sessionId = reqSession.getSessionId();
        const adminSessionInfo = await cmsSessionDao.get(sessionId)

        if (!adminSessionInfo) {
            return sessionError(ctx, next);
        }

        const sessionAdmin = new Admin(adminSessionInfo);
        Admin.validModel(sessionAdmin);

        const adminDao = new AdminDaoModel(dbMongo);

        const adminInfo = await adminDao.findOne({ adminId: sessionAdmin.getAdminId() });
        Admin.validModel(adminInfo);

        ctx.$dbMongo = dbMongo;
        ctx.$dbRedis = dbRedis;
        ctx.$adminInfo = adminInfo;

        await next();

    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    commonAuthCheck
}