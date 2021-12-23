const ReqCheatDeleteMission = require("@ss/models/controller/ReqCheatDeleteMission");
const QuestService = require("@ss/service/QuestService");

module.exports = async (ctx, next) => {
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;
  const logDate = ctx.$date;

  const reqDeletMission = new ReqCheatDeleteMission(ctx.request.body);
  ReqCheatDeleteMission.validModel(reqDeletMission);

  const { storyId, qId } = reqDeletMission;

  const questService = new QuestService(userInfo, logDate);

  const clearList = await questService.cheatDel(storyId, qId);
  await questService.finalize();

  ctx.$res.success({ clearList });

  await next();
};
