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
    const uid = userInfo.getUID();
    const userStatus = await aiDao.getUserStatus(uid);

    if (userStatus) {
        ctx.$res.badRequest(SSError.Service.Code.aiGenerateAlreadyStarted);
        await next();
        return;
    }

    const prompt = reqAIGenerate.getPrompt();
    const language = reqAIGenerate.getLanguage();
    
    const fileName = createHash(prompt, 10);
    const seedId = Math.floor(1 + Math.random() * 900000);

    await aiDao.setUserStatus(uid, { status: 1, fileName, seedId, prompt, language });
    
    await aiDao.pushAIGenerate(prompt, fileName, seedId, uid, language);

    ctx.$res.success({
        userStatus
    });

    await next();
}
