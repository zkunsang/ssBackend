const ReqQuestStoryUpdateMany = require('@ss/models/cmsController/ReqQuestStoryUpdateMany');
const QuestStoryDao = require('@ss/daoMongo/QuestStoryDao');
const QuestStoryRewardDao = require('@ss/daoMongo/QuestStoryRewardDao');
const QuestStoryGoalDao = require('@ss/daoMongo/QuestStoryGoalDao');
const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;


module.exports = async (ctx, next) => {
    const reqStoryQuestUpdateMany = new ReqQuestStoryUpdateMany(ctx.request.body);
    ReqQuestStoryUpdateMany.validModel(reqStoryQuestUpdateMany);

    const storyId = reqStoryQuestUpdateMany.getStoryId();

    let questStoryList = reqStoryQuestUpdateMany.getQuestStoryList();
    let questStoryGoalList = reqStoryQuestUpdateMany.getQuestStoryGoalList();
    let questStoryRewardList = reqStoryQuestUpdateMany.getQuestStoryRewardList();

    const questStoryDao = new QuestStoryDao(ctx.$dbMongo);
    const questStoryRewardDao = new QuestStoryRewardDao(ctx.$dbMongo);
    const questStoryGoalDao = new QuestStoryGoalDao(ctx.$dbMongo);

    questStoryList = questStoryList.map((data) => { return { ...data, storyId } });
    questStoryGoalList = questStoryGoalList.map((data) => { return { ...data, storyId } });
    questStoryRewardList = questStoryRewardList.map((data) => { return { ...data, storyId } });

    await questStoryDao.deleteMany({ storyId });
    await questStoryRewardDao.deleteMany({ storyId });
    await questStoryGoalDao.deleteMany({ storyId });

    await questStoryDao.insertMany(questStoryDao.transModelList(questStoryList));
    await questStoryGoalDao.insertMany(questStoryGoalDao.transModelList(questStoryGoalList));
    await questStoryRewardDao.insertMany(questStoryRewardDao.transModelList(questStoryRewardList));

    ctx.status = 200;
    ctx.body.data = {};

    dbRedisPB.publish(Channels.questStory, 'need refresh');
    await next();
}