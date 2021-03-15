const ReqAuthLogout = require('@ss/models/umsController/ReqAuthLogout');
const UmsSessionDao = require('@ss/daoRedis/UmsSessionDao');
const dbRedis = require('@ss/dbRedisSS');

module.exports = async (ctx, next) => {
    const reqAuthRegist = new ReqAuthLogout(ctx.request.body);
    ReqAuthLogout.validModel(reqAuthRegist);

    const sessionId = reqAuthRegist.getSessionId();
    const umsSessionDao = new UmsSessionDao(dbRedis);
    
    await umsSessionDao.del(sessionId);
    
    ctx.$res.setResultCode(0);
    ctx.$res.success({});
    return await next();
};

