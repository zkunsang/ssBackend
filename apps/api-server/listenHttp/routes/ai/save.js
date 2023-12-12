const SSError = require('@ss/error');


const AIDao = require('@ss/daoRedis/AIDao');
const dbRedisAI = require('@ss/dbRedisAI');
const ReqAISave = require('@ss/models/controller/ai/ReqAISave');
const UserResourceService = require('@ss/service/UserResourceService');

const checkValidItemList = (userStatus, itemList) => {
    // 아이템 개수가 0개 에러 발생
    const { status, prompt, fileName, seedId, imageLength } = userStatus

    for (let i = 0; i < itemList.length; i++) {
        const s3key = itemList[i];
        const s3KeySplit =  s3key.split('/');
        
        if(s3KeySplit.length !== 3) throw Error("inavlid item")

        const [_filename, _seedId, _fileNameExt] = s3KeySplit;
        const fileIndex = Number(_fileNameExt.replace(".png", ""));

        if(_filename !== fileName) throw Error("inavlid item")
        if(Number(_seedId) !== Number(seedId)) throw Error("inavlid item")
        if(fileIndex >= imageLength) throw Error("inavlid item")
        if(fileIndex < 0) throw Error("inavlid item")
    }
}


module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    const updateDate = ctx.$date;

    const reqAiSave = new ReqAISave(ctx.request.body);
    ReqAISave.validModel(reqAiSave);

    const itemList = reqAiSave.getItemList();

    if (itemList.length == 0) {
        await aiDao.delUserStatus(puid);
        const userResourceService = new UserResourceService(userInfo, updateDate);
        const aiStickers = await userResourceService.checkAISticker();
        ctx.$res.success({ aiStickers });
        return
    } 

    const aiDao = new AIDao(dbRedisAI);
    const puid = userInfo.getPUID();
    const userStatus = await aiDao.getUserStatus(puid);

    const { status } = userStatus;
    if (status !== 2) {
        ctx.$res.badRequest(SSError.Service.Code.aiGenerateNotFinished);
        return;
    }
    
    try {
        checkValidItemList(userStatus, itemList)
    } catch {
        ctx.$res.badRequest(SSError.Service.Code.aiGenerateInvalidItem);
        return;
    }
    
    const userResourceService = new UserResourceService(userInfo, updateDate);
    const aiStickers = await userResourceService.updateAiSticker(itemList);

    await userResourceService.finalize();
    await aiDao.delUserStatus(puid);

    ctx.$res.success({ aiStickers });

    await next();
}
