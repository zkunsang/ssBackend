const ReqUserAction = require('@ss/models/controller/ReqUserAction');
const UserQuestStory = require('@ss/models/mongo/UserQuestStory');

const ActionLogDao = require('@ss/daoMongo/ActionLogDao');
const ActionLog = require('@ss/models/apilog/ActionLog');

const InventoryService = require('@ss/service/InventoryService');

const QuestStoryCache = require('@ss/dbCache/QuestStoryCache');

const InventoryDao = require('@ss/daoMongo/InventoryDao');
const InvenLogDao = require('@ss/daoMongo/InvenLogDao');
const UserQuestStoryDao = require('@ss/daoMongo/UserQuestStoryDao');

function createActionLog(uid, storyId, actionList, logDate) {
    const retActionList = [];

    for (const action of actionList) {
        retActionList.push(new ActionLog({ uid, storyId, ...action, logDate }));
    }

    return retActionList;
}

module.exports = async (ctx, next) => {
    const reqUserAction = new ReqUserAction(ctx.request.body);
    ReqUserAction.validModel(reqUserAction);

    const logDate = ctx.$date;
    const dbMongo = ctx.$dbMongo;
    const userInfo = ctx.$userInfo;

    const uid = userInfo.getUID();
    const actionList = reqUserAction.getActionList();
    const storyId = reqUserAction.getStoryId();

    const actionLogDao = new ActionLogDao(dbMongo);
    await actionLogDao.insertMany(createActionLog(uid, storyId, actionList));

    const questSet = new Set();

    const userNewActionMap = {};

    for (const action of actionList) {
        if (!userNewActionMap[action.actionId]) {
            const _questList = QuestStoryCache.getQuestListByTargetId(storyId, action.actionId);
            if (!_questList)
                continue;

            _questList.map((quest) => questSet.add(quest.questId));

            userNewActionMap[action.actionId] = 0;
        }

        userNewActionMap[action.actionId] += 1;
    }

    const questList = Array.from(questSet);

    // 1. 유저가 해당 퀘스트를 클리어했는지를 검사
    const userQuestStoryDao = new UserQuestStoryDao(dbMongo);
    const userQuestStory = await userQuestStoryDao.findOne({ storyId, uid });

    const userAccuiredQuest = userQuestStory ? userQuestStory.getQuestStory() : {};
    const userStoryAction = userQuestStory ? userQuestStory.getStoryAction() : {};

    const newClearQuest = [];
    
    for (const questId of questList) {
        // 유저가 이미 획득한 퀘스트면 패스
        if (userAccuiredQuest[questId]) continue;

        const goalList = QuestStoryCache.getQuestGoalList(storyId, questId);

        let isClear = true;

        for (const goal of goalList) {
            // 전부다 했는지 확인
            // 유저가 골에 대한 액션 카운트를 가지고 있는지 확인
            let userCount = userStoryAction[goal.actionId] ? userStoryAction[goal.actionId] : 0;

            // 신규 추가된 액션에 대한 카운팅
            if (userNewActionMap[goal.actionId]) {
                userCount += userNewActionMap[goal.actionId];
            }

            if (goal.count > userCount) isClear = false;

            if (userCount != 0) {
                userStoryAction[goal.actionId] = userCount;
            }
        }

        if (isClear) {
            userAccuiredQuest[questId] = logDate;
            newClearQuest.push(questId);
        }
    }

    const updateObject = {
        questStory: userAccuiredQuest,
        storyAction: userStoryAction
    }

    const clearQuest = [];
    const putInvenRewardList = [];

    for (const quest of newClearQuest) {
        const rewardList = QuestStoryCache.getQuestRewardList(storyId, quest);
        clearQuest.push({ questId: quest, rewardList });

        ctx.$res.addData({ clearQuest });

        putInvenRewardList.push(...rewardList);
    }

    const invenLogDao = new InvenLogDao(dbMongo, logDate);
    const inventoryDao = new InventoryDao(dbMongo);

    const inventoryService = new InventoryService(inventoryDao, userInfo, logDate, invenLogDao);

    const retObject = {};

    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);
    
    if (putInvenRewardList.length > 0) {
        await inventoryService.processPut(
            InventoryService.PUT_ACTION.STORY_QUEST,
            InventoryService.makeInventoryList(putInvenRewardList));

        const userInventoryList = await inventoryService.getUserInventoryList();
        InventoryService.removeObjectIdList(userInventoryList);
        ctx.$res.addData({ inventoryList: userInventoryList });

        retObject.inventoryList = userInventoryList;
    }

    if (userQuestStory) {
        const _id = userQuestStory._id;
        await userQuestStoryDao.updateOne({ _id }, updateObject);
    }
    else {
        await userQuestStoryDao.insertOne(new UserQuestStory({ storyId, uid, ...updateObject }));
    }

    ctx.status = 200;
    ctx.$res.success();

    await next();
};