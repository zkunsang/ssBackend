const ReqQuestCheck = require('@ss/models/controller/ReqQuestCheck');

const StoryCache = require('@ss/dbCache/StoryCache');
const SSError = require('@ss/error');

const QuestService = require('@ss/service/QuestService');
const StoryService = require('@ss/service/StoryService');

module.exports = async (ctx, next) => {
    const reqQuestCheck = new ReqQuestCheck(ctx.request.body);
    ReqQuestCheck.validModel(reqQuestCheck);

    const logDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const storyId = reqQuestCheck.getStoryId();
    const questId = reqQuestCheck.getQuestId();

    const storyData = StoryCache.get(storyId);

    if (!storyData) {
        ctx.$res.badRequest(SSError.Service.Code.storyNoExist);
        return;
    }

    const questService = new QuestService(userInfo, logDate);
    const questInfo = await questService.getQuestInfo(storyId, questId);

    const actionList = questService.parseAction(questInfo.storyAction);

    console.log("** questInfo", actionList);

    ctx.$res.success({ actionList });

    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/accessory
 * operations:
 *   -  httpMethod: POST
 *      summary: 악세사리 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>itemId: 아이템 아이디
 *      responseClass: resShopAccessory
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqQuestCheck
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqQuestCheck:
 *     id: reqQuestCheck
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       itemId:
 *         type: String
 *         required: true
 *         description: 아이템 아이디
 *   resShopAccessory:
 *     id: resShopAccessory
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */