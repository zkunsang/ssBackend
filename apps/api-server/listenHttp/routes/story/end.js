const ReqStoryEnd = require('@ss/models/controller/ReqStoryEnd');

const InventoryLogDao = require('@ss/daoMongo/InventoryLogDao');
const StoryLogDao = require('@ss/daoMongo/StoryLogDao');
const StoryTempEventDao = require('@ss/daoMongo/StoryTempEventDao');

const StoryLog = require('@ss/models/mongo/StoryLog');
const StoryTempEvent = require('@ss/models/mongo/StoryTempEvent');

const StoryCache = require('@ss/dbCache/StoryCache');
const SSError = require('@ss/error');
const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;

    const reqStoryEnd = new ReqStoryEnd(ctx.request.body);
    ReqStoryEnd.validModel(reqStoryEnd);

    const storyId = reqStoryEnd.getStoryId();
    const storyInfo = StoryCache.get(storyId);

    if(!storyInfo) {
        ctx.$res.badRequest(SSError.Service.Code.storyNoExist);
        return;
    }

    // 해당 스토리를 다 읽은 로그 저장
    const userInfo = ctx.$userInfo;

    const uid = userInfo.uid;
    const type = StoryLog.StoryLogType.END;

    const storyLogDao = new StoryLogDao(ctx.$dbMongo, updateDate);
    
    await storyLogDao.insertOne(new StoryLog({ uid, storyId, updateDate, type }));

    // TODO: 임시 이벤트
    let eventRewardCode = 0;
    let inventoryList = null;
    if("PussInBoots" == storyId) {
        const storyTempEventDao = new StoryTempEventDao(ctx.$dbMongo);

        const eventInfo = await storyTempEventDao.findOne({ uid, storyId });

        if(!eventInfo) {
            const inventoryLogDao = new InventoryLogDao(ctx.$dbMongo, updateDate);

            const result = await processBetaEvent(storyTempEventDao, userInfo, storyId, updateDate, inventoryLogDao);
            inventoryList = result.userInventoryList;
            eventRewardCode = result.eventRewardCode;
        }
    }
    
    ctx.$res.success({ eventRewardCode, inventoryList });
    await next();
}

async function processBetaEvent(inventoryDao, storyTempEventDao, userInfo, storyId, updateDate, inventoryLogDao) {
    const eventRewardCode = 100;
    
    const uid = userInfo.uid;
    const inventoryService = new InventoryService(userInfo, updateDate, inventoryLogDao);

    const itemList = [];

    const honey = InventoryService.makeInventoryObject('honey', 50);
    itemList.push(honey);

    await inventoryService.processPut(
        InventoryService.PUT_ACTION.EVENT.BETA_EVENT, 
        itemList);

    const userInventoryList = await inventoryService.getUserInventoryList();
    
    await storyTempEventDao.insertOne(new StoryTempEvent({ uid, storyId, updateDate }));

    return { userInventoryList, eventRewardCode };
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