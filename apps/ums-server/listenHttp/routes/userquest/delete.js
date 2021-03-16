const shortid = require("shortid");
const dbMongo = require('@ss/dbMongo');

const UserDao = require('@ss/daoMongo/UserDao');
const InventoryLogDao = require('@ss/daoMongo/InventoryLogDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
const UserQuestStoryDao = require('@ss/daoMongo/UserQuestStoryDao');
const InventoryService = require('@ss/service/InventoryService');

const ReqUserQuestDelete = require('@ss/models/umsController/ReqUserQuestDelete');
const QuestStoryCache = require('@ss/dbCache/QuestStoryCache');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqUserQuestDelete = new ReqUserQuestDelete(ctx.request.body);
    const adminId = ctx.$adminInfo.adminId;

    ReqUserQuestDelete.validModel(reqUserQuestDelete);

    const uid = reqUserQuestDelete.getUID();
    
    const userDao = new UserDao(dbMongo);

    const userInfo = await userDao.findOne({uid});
    const userQuestStoryDao = new UserQuestStoryDao(dbMongo);

    // 유저 퀘스트 삭제
    const userQuestList = await userQuestStoryDao.findMany({uid});

    if(userQuestList.length === 0) {
        ctx.status = 200;
        ctx.body.data = {};
        return;
    }

    const totalRewardList = [];
    for(const userQuest of userQuestList) {
        const storyId = userQuest.storyId;
        const clearQuestList = Object.keys(userQuest.questClear);
        for(const clearQuest of clearQuestList) {
            const rewardList =  QuestStoryCache.getQuestRewardList(storyId, clearQuest);
            totalRewardList.push(...rewardList);
        }
    }

    if(totalRewardList.length > 0) {
        const inventoryLogDao = new InventoryLogDao(dbMongo, updateDate);
        const inventoryService = new InventoryService(userInfo, updateDate, inventoryLogDao)
        const editKey = shortid.generate();

        const adminInfo = { adminId, editKey };
        const addInfo = { adminInfo };
        
        const useInvenList = InventoryDao.mappingList(totalRewardList);
        
        inventoryService.processUse(
            InventoryService.USE_ACTION.QUEST_DELETE,
            useInvenList,
            addInfo);    
    }

    await userQuestStoryDao.deleteMany({uid});
    
    ctx.status = 200;
    ctx.body.data = {};

    await next();
};