const ReqQuestCommon = require("@ss/models/controller/ReqQuestCommon");

const StoryCache = require("@ss/dbCache/StoryCache");
const SSError = require("@ss/error");

const QuestService = require("@ss/service/QuestService");
const StoryService = require("@ss/service/StoryService");
const MailService = require("@ss/service/MailService");
const InventoryService = require("@ss/service/InventoryService");
const User = require("@ss/models/mongo/User");
const UserService = require("@ss/service/UserService");
const UserDao = require("@ss/daoMongo/UserDao");
const dbMongo = require("@ss/dbMongo");

module.exports = async (ctx, next) => {
  const reqQuestCommon = new ReqQuestCommon(ctx.request.body);
  ReqQuestCommon.validModel(reqQuestCommon);

  const logDate = ctx.$date;
  const userInfo = ctx.$userInfo;

  const storyId = reqQuestCommon.getStoryId();
  const questIds = reqQuestCommon.getQuestIds();

  const storyData = StoryCache.get(storyId);

  if (!storyData) {
    ctx.$res.badRequest(SSError.Service.Code.storyNoExist);
    return;
  }

  const questService = new QuestService(userInfo, logDate);
  const { newClearQuests, clearQuests, rewardMailList } =
    await questService.completeCommonQuest({ storyId, questIds });

  const userService = new UserService(userInfo, null, logDate);

  // 우편 발송
  if (rewardMailList) {
    const mailService = new MailService(userInfo, logDate);

    for (const reward of rewardMailList) {
      mailService.sendMail({ ...reward });
    }

    const newMail = mailService.finalize();
    userService.setMail(newMail);
    ctx.$res.addData({ mail: Object.values(newMail) });
    await userService.finalize();
  }

  ctx.$res.success({ clearQuests: Object.keys(clearQuests), newClearQuests });

  await next();
};
