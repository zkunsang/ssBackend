const UserResourceService = require('@ss/service/UserResourceService');

module.exports = async (ctx, next) => {
    const userInfo = ctx.$userInfo;
    const updateDate = ctx.$date;
    
    const userResourceService = new UserResourceService(userInfo, updateDate);
    const aiStickers = await userResourceService.checkAISticker();
    
    ctx.$res.success({ aiStickers });

    await next();
}
