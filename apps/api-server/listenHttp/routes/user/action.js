const ReqUserAction = require('@ss/models/controller/ReqUserAction');

const InventoryService = require('@ss/service/InventoryService');
const QuestService = require('@ss/service/QuestService');
const UserService = require('@ss/service/UserService');
const StoryService = require('@ss/service/StoryService');

module.exports = async (ctx, next) => {
    const reqUserAction = new ReqUserAction(ctx.request.body);
    ReqUserAction.validModel(reqUserAction);

    const logDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const actionList = reqUserAction.getActionList();
    const storyId = reqUserAction.getStoryId();

    const storyService = new StoryService(userInfo, logDate);
    storyService.checkStoryList([storyId]);

    const questService = new QuestService(userInfo, logDate);
    const userService = new UserService(userInfo, userDao, logDate);

    const { clearQuest, rewardList } = await questService.checkUserAction(storyId, actionList);

    if (rewardList.length > 0) {
        const inventoryService = new InventoryService(userInfo, logDate);
        for (const reward of rewardList) {
            const { addInfo, action, itemList } = reward;
            inventoryService.putItem(action, addInfo, itemList);
        }

        const inventory = inventoryService.finalize();
        userService.setInventory(inventory);

        ctx.$res.addData({ inventory });
        ctx.$res.addData({ clearQuest });
    }

    ctx.$res.success();

    await next();
};