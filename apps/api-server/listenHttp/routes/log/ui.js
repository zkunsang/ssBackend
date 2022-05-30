const ReqLogUI = require("@ss/models/controller/log/ReqLogUI");
const LogService = require("@ss/service/LogService");

module.exports = async (ctx, next) => {
  const reqLogUI = new ReqLogUI(ctx.request.body);
  ReqLogUI.validModel(reqLogUI);

  const userInfo = ctx.$userInfo;
  const logDate = ctx.$date;

  const logService = new LogService(userInfo, logDate);
  logService.sendUILog(reqLogUI);

  ctx.$res.success({});
  await next();
};
