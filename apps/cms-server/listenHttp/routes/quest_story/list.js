const ReqQuestStoryList = require('@ss/models/cmsController/ReqQuestStoryList');
const QuestStoryDao = require('@ss/daoMongo/QuestStoryDao');
const QuestStoryGoalDao = require('@ss/daoMongo/QuestStoryGoalDao');
const QuestStoryRewardDao = require('@ss/daoMongo/QuestStoryRewardDao');

module.exports = async (ctx, next) => {
    const reqQuestStoryList = new ReqQuestStoryList(ctx.request.body);
    ReqQuestStoryList.validModel(reqQuestStoryList);

    const storyId = reqQuestStoryList.getStoryId();

    const questStoryDao = new QuestStoryDao(ctx.$dbMongo);
    const questStoryRewardDao = new QuestStoryRewardDao(ctx.$dbMongo);
    const questStoryGoalDao = new QuestStoryGoalDao(ctx.$dbMongo);

    const questStoryList = await questStoryDao.findMany({ storyId });
    const questStoryRewardList = await questStoryRewardDao.findMany({ storyId });
    const questStoryGoalList = await questStoryGoalDao.findMany({ storyId });


    ctx.status = 200;
    ctx.body.data = { questStoryList, questStoryRewardList, questStoryGoalList };
    await next();

}