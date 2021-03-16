const ReqShopAccessory = require('@ss/models/controller/ReqShopAccessory');

const InventoryLogDao = require('@ss/daoMongo/InventoryLogDao');

const ItemService = require('@ss/service/ItemService');
const InventoryService = require('@ss/service/InventoryService');

const ItemCache = require('@ss/dbCache/ItemCache');
const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    const reqShopAccessory = new ReqShopAccessory(ctx.request.body);
    ReqShopAccessory.validModel(reqShopAccessory);
    
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const itemService = new ItemService();
    
    const itemId = reqShopAccessory.getItemId();
    itemService.getItemList([itemId]);

    const itemInfo = ItemCache.get(itemId);

    // 구매 가능한 상태가 아니면 에러 
    if(itemInfo.status !== 1) {
        ctx.$res.badRequest(SSError.Service.Code.purchaseNotPossible);
        return;
    }
    
    const itemInventory = InventoryService.makeInventoryObject(itemId, 1);

    const { putInventoryList, useInventoryList } 
        = itemService.getExchangeInventoryInfo([itemInventory]);

    const inventoryLogDao = new InventoryLogDao(ctx.$dbMongo, updateDate);
    const inventoryService = new InventoryService(userInfo, updateDate, inventoryLogDao);
    InventoryService.validModel(inventoryService);

    inventoryService.processExchange(
        InventoryService.USE_ACTION.EXCHANGE.ACCESSORY, 
        useInventoryList, 
        InventoryService.PUT_ACTION.EXCHANGE.ACCESSORY, 
        putInventoryList);

    const userInventoryList = await inventoryService.getUserInventoryList();

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