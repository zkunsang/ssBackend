const ReqShopItems = require("@ss/models/controller/ReqShopItems");

const UserService = require("@ss/service/UserService");
const ItemService = require("@ss/service/ItemService");
const InventoryService = require("@ss/service/InventoryService");

module.exports = async (ctx, next) => {
  const reqShopItems = new ReqShopItems(ctx.request.body);
  ReqShopItems.validModel(reqShopItems);

  const updateDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const itemService = new ItemService(userInfo);

  const itemList = reqShopItems.getItemList();

  const inventoryService = new InventoryService(userInfo, updateDate);

  const itemInventories = [];
  for (let i = 0; i < itemList.length; i++) {
    const itemId = itemList[i];
    const itemData = itemService.checkPurchaseItem(itemId);
    const itemInventory = inventoryService.makeInventoryObject(
      itemId,
      itemData.itemQny
    );
    itemInventories.push(itemInventory);
  }

  const { putInventoryList, useInventoryList } =
    itemService.getExchangeInventoryInfo(itemInventories);

  // inventoryService.checkAlready(putInventoryList);
  const useItem = inventoryService.useItem(
    InventoryService.USE_ACTION.EXCHANGE.ITEMS,
    {},
    useInventoryList
  );
  const putItem = inventoryService.putItem(
    InventoryService.PUT_ACTION.EXCHANGE.ITEMS,
    {},
    putInventoryList
  );

  const honeyHistory = inventoryService.createExchangeHoneyHistory(
    putItem,
    useItem,
    InventoryService.USE_ACTION.EXCHANGE.ITEMS
  );

  const inventory = inventoryService.finalize();

  const userService = new UserService(userInfo, userDao, updateDate);

  userService.addHoneyHistory(honeyHistory);
  userService.setInventory(inventory);
  userService.finalize();

  ctx.$res.success({
    inventory,
    honeyHistory: userService.getHoneyHistory(),
  });

  await next();
};

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
