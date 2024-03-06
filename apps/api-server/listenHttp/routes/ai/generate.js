const ss = require('@ss');
const SSError = require('@ss/error');
const ReqAIGenerate = require('@ss/models/controller/ai/ReqAIGenerate');

const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');

const crypto = require("crypto");
const { ask } = require('@ss/util/chatGPTUtil');
const LogService = require('@ss/service/LogService');

const createHash = (data, len) => {
    return crypto.createHash("shake256", { outputLength: len })
      .update(data)
      .digest("hex");
}

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    const updateDate = ctx.$date;

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

    setTimeout(async() => {
        const keyword = reqAIGenerate.getKeyword()
        const _keyword = await ask(keyword);

        const prompt = reqAIGenerate.getPrompt();
        const _prompt = prompt.replace("{0}", _keyword);

        const language = reqAIGenerate.getLanguage();
        const s3BucketName = ss.configs.apiServer.s3BucketName;
        const mode = ss.configs.apiServer.mode;
        
        const fileName = createHash(_prompt, 10);
        const seedId = Math.floor(1 + Math.random() * 900000);

        const logService = new LogService(userInfo, updateDate);
        logService.sendUserAIStickerLog({ uid, prompt: _prompt, keyword, lastKeyword: _keyword })

        await aiDao.setUserStatus(uid, { status: 1, fileName, seedId, _prompt, language });
        await aiDao.pushAIGenerate(_prompt, fileName, seedId, uid, language, s3BucketName, mode);
    }, 10);

    ctx.$res.success({});

    await next();
}
