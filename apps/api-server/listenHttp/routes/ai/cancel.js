
const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');
const ReqAICancel = require('@ss/models/controller/ai/ReqAICancel');

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    
    
    const reqAICheck = new ReqAICancel(ctx.request.body);

    // redis에서 해당 유저의 AI진행 중인 정보를 가져온다
    const aiDao = new AIDao(dbRedisAI);
    const uid = userInfo.getUID();
    const userStatus = await aiDao.delUserStatus(uid)

    ctx.$res.success({
        ...userStatus
    });

    await next();
}
