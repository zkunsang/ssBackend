const ReqShopStory = require('@ss/models/controller/ReqShopStory');

const InventoryDao = require('@ss/daoMongo/InventoryDao');

const ItemService = require('@ss/service/ItemService');
const StoryService = require('@ss/service/StoryService');
const InventoryService = require('@ss/service/InventoryService');

function makeStoryInventoryList(storyList) {
    return storyList.map((item) => InventoryService.makeInventoryObject(item, 1));
}

module.exports = async (ctx, next) => {
    const reqShopStory = new ReqShopStory(ctx.request.body);
    ReqShopStory.validModel(reqShopStory);
    
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    
    const itemService = new ItemService();
    const storyService = new StoryService()
    
    const needStoryList = reqShopStory.getStoryList();
    storyService.getStoryList(needStoryList);
    
    const storyInvenList = makeStoryInventoryList(needStoryList);

    const { putInventoryList, useInventoryList } 
        = itemService.getExchangeInventoryInfo(storyInvenList);

    itemService.applyCoupon(useInventoryList, reqShopStory.getCouponId());

    const inventoryService = new InventoryService(inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processExchange(
        InventoryService.USE_ACTION.EXCHANGE.STORY,
        useInventoryList, 
        InventoryService.PUT_ACTION.EXCHANGE.STORY,
        putInventoryList);

    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);
    ctx.status = 200;
    ctx.body.data = { inventoryList: userInventoryList };

    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/story
 * operations:
 *   -  httpMethod: POST
 *      summary: 동화 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>storyList: 동화 정보
 *      responseClass: resShopStory
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqShopStory
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopStory:
 *     id: reqShopStory
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       storyList:
 *         type: array
 *         items: 
 *           type: string
 *         required: true
 *         description: 동화 아이디
 *   resShopStory:
 *     id: resShopStory
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */