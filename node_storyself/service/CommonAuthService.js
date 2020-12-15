const SSError = require('@ss/error');

const dbMongo = require('../dbMongo');
const dbRedis = require('../dbRedisSS');

const ReqSession = require('../models/cmsController/ReqSession');
const SessionDao = require('../daoRedis/SessionDao');

const User = require('../models/mongo/User');
const UserDao = require('../daoMongo/UserDao');

const ResContext = require('../context/ResContext');

module.exports = async (ctx, next) => {
    const reqSession = new ReqSession(ctx.request.body);
    ReqSession.validModel(reqSession);
    
    const sessionDao = new SessionDao(dbRedis);

    const sessionId = reqSession.getSessionId();
    const sessionObj = await sessionDao.get(sessionId)

    if(!sessionObj) {
        ctx.$res.unauthorized(SSError.Service.Code.noExistSession);
        return;
    }

    const userSessionInfo = new User(sessionObj);
    User.validModel(userSessionInfo);

    const userDao = new UserDao(dbMongo);
    const userInfo = await userDao.findOne({ uid: userSessionInfo.getUID() });

    ctx.$dbMongo = dbMongo;
    ctx.$dbRedis = dbRedis;

    ctx.$userDao = userDao;
    ctx.$userInfo = userInfo;

    await next();

    await sessionDao.update(sessionId);
};