const SSError = require('@ss/error');
const ReqAIGenerate = require('@ss/models/controller/ai/ReqAIGenerate');

const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');

const crypto = require("crypto");

const createHash = (data, len) => {
    return crypto.createHash("shake256", { outputLength: len })
      .update(data)
      .digest("hex");
}

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;

    const reqAIGenerate = new ReqAIGenerate(ctx.request.body);
    ReqAIGenerate.validModel(reqAIGenerate);

    const aiDao = new AIDao(dbRedisAI);
    const puid = userInfo.getPUID();
    const userStatus = await aiDao.getUserStatus(puid);

    if (userStatus) {
        ctx.$res.badRequest(SSError.Service.Code.aiGenerateAlreadyStarted);
        return;
    }

    const prompt = reqAIGenerate.getPrompt();
    const fileName = createHash(prompt, 10);
    const seedId = 1;

    await aiDao.setUserStatus(puid, { status: 1, fileName, seedId, prompt });
    
    await aiDao.pushAIGenerate(prompt, fileName, seedId, puid);

    ctx.$res.success({
        userStatus
    });

    await next();
}
