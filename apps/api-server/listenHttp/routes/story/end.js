const ReqStoryEnd = require('@ss/models/controller/ReqStoryEnd');

const StoryService = require('@ss/service/StoryService');
const UserService = require('@ss/service/UserService');
const StoryEventService = require('@ss/service/StoryEventService');

const StoryCache = require('@ss/dbCache/StoryCache');
const SSError = require('@ss/error');

const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqStoryEnd = new ReqStoryEnd(ctx.request.body);
    ReqStoryEnd.validModel(reqStoryEnd);

    const storyId = reqStoryEnd.getStoryId();
    const startKey = reqStoryEnd.getStartKey();
    const readTime = reqStoryEnd.getReadTime();

    const storyInfo = StoryCache.get(storyId);

    if (!storyInfo) {
        ctx.$res.badRequest(SSError.Service.Code.storyNoExist);
        return;
    }

    // 해당 스토리를 다 읽은 로그 저장
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const userService = new UserService(userInfo, userDao, updateDate);
    const storyService = new StoryService(userInfo, updateDate);

    // storyService.checkHasStory(storyId);
    storyService.endLog(storyId, startKey, readTime);
    await storyService.finalize();

    // const storyEventService = new StoryEventService(userInfo, updateDate);
    // const eventRewardList = await storyEventService.storyEvent(storyId);

    // if (eventRewardList.length > 0) {
    //     const inventoryService = new InventoryService(userInfo, updateDate);
    //     inventoryService.putEventItemList(eventRewardList);

    //     const inventory = inventoryService.finalize();
    //     userService.setInventory(inventory);

    //     ctx.$res.addData({ inventory });
    // }

    // await userService.finalize();

    ctx.$res.success({ startKey });

    await next();
}



/**
 * @swagger
 * resourcePath: /story
 * description: All about API
 */

/**
 * @swagger
 * path: /story/data
 * operations:
 *   -  httpMethod: POST
 *      summary: 스토리 데이터(임시)
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resStoryData
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqStoryData
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqStoryData:
 *     id: reqStoryData
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *   resStoryData:
 *     id: resStoryData
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *       data:
 *         type: data
 *   data:
 *     id: data
 *     properties:
 *       itemList:
 *         type: array
 *         items:
 *           type: item
 *       itemMaterialList:
 *         type: array
 *         items:
 *           type: itemMaterial
 *       productList:
 *         type: array
 *         items:
 *           type: product
 *       productGroupList:
 *         type: array
 *         items:
 *           type: productGroup
 *       productRewardList:
 *         type: array
 *         items:
 *           type: productReward
 *       resourceList:
 *         type: array
 *         items:
 *           type: resource
 *       storyList:
 *         type: array
 *         items:
 *           type: story
 *   item:
 *     id: item
 *     properties:
 *       itemId:
 *         type: String
 *       itemCategory:
 *         type: String
 *       groupId:
 *         type: String
 *       useable:
 *         type: number
 *       overlap:
 *         type: number
 *       priority:
 *         type: number
 *   itemMaterial:
 *     id: itemMaterial
 *     properties:
 *       itemId:
 *         type: String
 *       materialId:
 *         type: String
 *       materialQny:
 *         type: number
 *   product:
 *     id: product
 *     properties:
 *       productId:
 *         type: String
 *       productType:
 *         type: String
 *       cost:
 *         type: number
 *       google:
 *         type: String
 *       apple:
 *         type: String
 *       userLimit:
 *         type: number
 *       serverLimit:
 *         type: number
 *   productGroup:
 *     id: productGroup
 *     properties:
 *       groupId:
 *         type: String
 *       startDate:
 *         type: number
 *       endDate:
 *         type: number
 *       serverLimit:
 *         type: number
 *   productReward:
 *     id: productReward
 *     properties:
 *       productId:
 *         type: String
 *       rewardType:
 *         type: String
 *       rewardId:
 *         type: String
 *       rewardQny:
 *         type: Number
 *   resource:
 *     id: resource
 *     properties:
 *       storyId:
 *         type: String
 *       resourceId:
 *         type: String
 *       size:
 *         type: number
 *       version:
 *         type: number
 *       crc32:
 *         type: String
 *   story:
 *     id: story
 *     properties:
 *       storyId:
 *         type: String
 *       version:
 *         type: number
 *       thumbnail:
 *         type: String
 *       thumbnailCrc32:
 *         type: String
 *       thumbnailVersion:
 *         type: number
 *
 * */