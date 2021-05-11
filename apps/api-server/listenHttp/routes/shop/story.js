const ReqShopStory = require('@ss/models/controller/ReqShopStory');

const ItemService = require('@ss/service/ItemService');
const UserService = require('@ss/service/UserService');
const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const reqShopStory = new ReqShopStory(ctx.request.body);
    ReqShopStory.validModel(reqShopStory);

    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const itemService = new ItemService(userInfo);

    const needStoryList = reqShopStory.getStoryList();
    itemService.checkPurchaseItemList(needStoryList);

    const inventoryService = new InventoryService(userInfo, updateDate);

    const storyInvenList = inventoryService.makeInventoryStoryList(needStoryList);

    const { putInventoryList, useInventoryList }
        = itemService.getExchangeInventoryInfo(storyInvenList);
    itemService.applyStorySale(putInventoryList, useInventoryList);
    itemService.applyCoupon(useInventoryList, reqShopStory.getCouponId());

    inventoryService.checkAlready(putInventoryList);

    const useItem = inventoryService.useItem(InventoryService.USE_ACTION.EXCHANGE.STORY, {}, useInventoryList);
    const putItem = inventoryService.putItem(InventoryService.PUT_ACTION.EXCHANGE.STORY, {}, putInventoryList);

    const honeyHistory = inventoryService.createExchangeHoneyHistory(putItem, useItem, InventoryService.USE_ACTION.EXCHANGE.STORY);

    const inventory = inventoryService.finalize();

    const userService = new UserService(userInfo, userDao, updateDate);
    userService.addHoneyHistory(honeyHistory);
    userService.setInventory(inventory);
    userService.finalize();

    ctx.$res.success({
        inventory,
        honeyHistory: userService.getHoneyHistory()
    });

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