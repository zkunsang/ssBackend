const ReqLogScene = require('@ss/models/controller/ReqLogScene');

const LogService = require('@ss/service/LogService');

module.exports = async (ctx, next) => {
    const reqLogScene = new ReqLogScene(ctx.request.body);
    ReqLogScene.validModel(reqLogScene);

    const userInfo = ctx.$userInfo;
    const logDate = ctx.$date;

    const logService = new LogService(userInfo, logDate);
    logService.sendSceneLog(reqLogScene);

    ctx.$res.success({});
    await next();
}

