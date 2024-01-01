const SSError = require('@ss/error');

const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');
const ReqAIDelete = require('@ss/models/controller/ai/ReqAIDelete');
const UserResourceService = require('@ss/service/UserResourceService');

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    const updateDate = ctx.$date;

    const reqAiDelete = new ReqAIDelete(ctx.request.body);
    ReqAIDelete.validModel(reqAiDelete);

    const itemList = reqAiDelete.getItemList();
    const userResourceService = new UserResourceService(userInfo, updateDate);

    if (itemList.length == 0) {
        ctx.$res.success({ aiStickers });
        await next();
        return;
    } 
    
    try {
        const newAiStickers = await userResourceService.deleteAiStickers(itemList)
        await userResourceService.finalize();

        ctx.$res.success({ aiStickers: newAiStickers });
    } catch {
        ctx.$res.badRequest(SSError.Service.Code.aiGenerateInvalidItem);
    }
    
    await next();
}
