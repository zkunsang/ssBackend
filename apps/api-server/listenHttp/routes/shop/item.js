const ReqShopItem = require('@ss/models/controller/ReqShopItem');

const InventoryDao = require('@ss/daoMongo/InventoryDao');

const ItemService = require('@ss/service/ItemService');
const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const reqShopItem = new ReqShopItem(ctx.request.body);
    ReqShopItem.validModel(reqShopItem);
    
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemService = new ItemService();
    
    const itemId = reqShopItem.getItemId();
    itemService.getItemList([itemId]);
    
    const itemInventory = InventoryService.makeInventoryObject(itemId, 1);

    const { putInventoryList, useInventoryList } 
        = itemService.getExchangeInventoryInfo([itemInventory]);

    const inventoryService = new InventoryService(inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processExchange(
        InventoryService.USE_ACTION.EXCHANGE.SLOT,
        useInventoryList, 
        InventoryService.PUT_ACTION.EXCHANGE.SLOT,
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