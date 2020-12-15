const ReqCheatPurchase = require('@ss/models/controller/ReqCheatPurchase');

const InventoryDao = require('@ss/daoMongo/InventoryDao');

const InventoryService = require('@ss/service/InventoryService');

const ProductLog = require('@ss/models/apilog/ProductLog');

const ProductCache = require('@ss/dbCache/ProductCache');
const ProductRewardCache = require('@ss/dbCache/ProductRewardCache');
const helper = require('@ss/helper');

function makeInventoryList(productRewardList) {
    return productRewardList.map((item) => item.makeInventoryObject());
}

function createProductLog(userInfo, productInfo, purchaseDate) {
    const uid = userInfo.uid;
    const productId = productInfo.productId;
    const cost = productInfo.costKr;

    return new ProductLog({ uid, productId, cost, purchaseDate })
}

module.exports = async (ctx, next) => {
    const purchaseDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    
    const reqCheatPurchase = new ReqCheatPurchase(ctx.request.body);
    ReqCheatPurchase.validModel(reqCheatPurchase);
    
    const productId = reqCheatPurchase.getProductId();
    const productInfo = ProductCache.get(productId);

    if (!productInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exist product info' };
        return;
    }

    const inventoryDao = new InventoryDao(ctx.$dbMongo);

    const productRewardList = ProductRewardCache.get(productId);
    
    const inventoryService = new InventoryService(inventoryDao, userInfo, purchaseDate);

    const inventoryList = makeInventoryList(productRewardList);
    await inventoryService.processPut(
        InventoryService.PUT_ACTION.CHEAT, 
        inventoryList);
    
    helper.fluent.sendProductLog(createProductLog(userInfo, productInfo, purchaseDate));
    
    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);
    
    ctx.status = 200;
    ctx.body.data = { inventoryList: userInventoryList };

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