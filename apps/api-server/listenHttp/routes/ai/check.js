const ReqAICheck = require('@ss/models/controller/ai/ReqAICheck');
const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    
    const reqAICheck = new ReqAICheck(ctx.request.body);

    // redis에서 해당 유저의 AI진행 중인 정보를 가져온다
    const aiDao = new AIDao(dbRedisAI);
    const uid = userInfo.getUID();
    const userStatus = await aiDao.getUserStatus(uid);

    ctx.$res.success({
        ...userStatus
    });

    await next();
}
