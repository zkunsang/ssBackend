const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');

const ReqLogFeedback = require('@ss/models/controller/ReqLogFeedback');
const LogService = require("@ss/service/LogService");

const Inventory = require('@ss/models/mongo/Inventory');

module.exports = async (ctx, next) => {
    const reqLogFeedback = new ReqLogFeedback(ctx.request.body);
    ReqLogFeedback.validModel(reqLogFeedback);

    const userInfo = ctx.$userInfo;
    const logDate = ctx.$date;

    // 만약 이미 feedback을 받았다면
    if (userInfo.feedBack) ctx.$res.success({ feedback: true });

    const userService = new UserService(userInfo, null, logDate);

    const inventoryService = new InventoryService(userInfo, logDate);

    inventoryService.putItem(
        InventoryService.PUT_ACTION.EVENT, {},
        [new Inventory({ itemId: 'honey', itemQny: 5 })]);

    const inventory = inventoryService.finalize();

    userService.setInventory(inventory);
    userService.setFeedback(true);
    userService.finalize();

    const logService = new LogService(userInfo, logDate);
    logService.sendFeedbackLog(reqLogFeedback);

    ctx.$res.success({ inventory, feedback: true });

    await next();


}

function getFeedbackReward() {
    const itemList = [];
    const honey = { itemId: 'honey', itemQny: 5 };
    itemList.push(honey);

    return itemList;
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
 *          dataType: reqShopAccessory
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopAccessory:
 *     id: reqShopAccessory
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