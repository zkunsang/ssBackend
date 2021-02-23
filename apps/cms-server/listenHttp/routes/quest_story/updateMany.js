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

    let questIdList = reqStoryQuestUpdateMany.getQuestIdList();
    let questGoalList = reqStoryQuestUpdateMany.getGoalList();
    let questRewardList = reqStoryQuestUpdateMany.getRewardList();

    const questStoryDao = new QuestStoryDao(ctx.$dbMongo);
    const questStoryRewardDao = new QuestStoryRewardDao(ctx.$dbMongo);
    const questStoryGoalDao = new QuestStoryGoalDao(ctx.$dbMongo);

    questIdList = questIdList.map((data) => { return { ...data, storyId } });
    questGoalList = questGoalList.map((data) => { return { ...data, storyId } });
    questRewardList = questRewardList.map((data) => { return { ...data, storyId } });

    await questStoryDao.deleteMany({ storyId });
    await questStoryRewardDao.deleteMany({ storyId });
    await questStoryGoalDao.deleteMany({ storyId });

    await questStoryDao.insertMany(questStoryDao.transModelList(questIdList));
    await questStoryGoalDao.insertMany(questStoryGoalDao.transModelList(questGoalList));
    await questStoryRewardDao.insertMany(questStoryRewardDao.transModelList(questRewardList));

    ctx.status = 200;
    ctx.body.data = {};

    dbRedisPB.publish(Channels.questStory, 'need refresh');
    await next();
}