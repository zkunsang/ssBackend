const ReqCheatPurchase = require('@ss/models/controller/ReqCheatPurchase');

const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');
const ProductService = require('@ss/service/ProductService');

const ArrayUtil = require('@ss/util/ArrayUtil');

module.exports = async (ctx, next) => {
    const purchaseDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const reqCheatPurchase = new ReqCheatPurchase(ctx.request.body);
    ReqCheatPurchase.validModel(reqCheatPurchase);

    const productId = reqCheatPurchase.getProductId();

    const productService = new ProductService(userInfo, purchaseDate);
    const productRewardList = productService.getForceProductRewardList(productId);

    const inventoryService = new InventoryService(userInfo, purchaseDate);

    const inventoryList = ArrayUtil.map(productRewardList, (item) => item.makeInventoryObject());

    const putItem = inventoryService.putItem(InventoryService.PUT_ACTION.CHEAT, {}, inventoryList);
    const cheatPutHistory = inventoryService.createPutHoneyHistory(putItem, InventoryService.PUT_ACTION.CHEAT);

    const inventory = inventoryService.finalize();

    const userService = new UserService(userInfo, userDao, purchaseDate);

    userService.addHoneyHistory(cheatPutHistory);
    userService.setInventory(inventory);
    userService.finalize();

    const honeyHistory = userService.getHoneyHistory();

    ctx.$res.success({ inventory, honeyHistory });

    await next();
}

/**
 * @swagger
 * resourcePath: /cheat
 * description: All about API
 */

/**
 * @swagger
 * path: /cheat/purchase
 * operations:
 *   -  httpMethod: POST
 *      summary: 치트 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resCheatPurchase
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqCheatPurchase
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqCheatPurchase:
 *     id: reqCheatPurchase
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       productId:
 *         type: String
 *         required: true
 *         description: 상품 아이디
 *   resCheatPurchase:
 *     id: resCheatPurchase
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *   common:
 *     id: common
 *     properties:
 *       serverTime:
 *         type: number
 *   error:
 *     id: error
 *     properties:
 *       message:
 *         type: String
 *       additional:
 *         type: String
 *   data:
 *     id: data
 *     properties:
 *       sessionId:
 *         type: String
 *
 * */