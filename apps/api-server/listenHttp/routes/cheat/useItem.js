const ReqCheatUseItem = require('@ss/models/controller/ReqCheatUseItem');
const InventoryLogDao = require('@ss/daoMongo/InventoryLogDao');

const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;
    
    const reqCheatUseItem = new ReqCheatUseItem(ctx.request.body);
    ReqCheatUseItem.validModel(reqCheatUseItem);
    
    const inventoryLogDao = new InventoryLogDao(ctx.$dbMongo, updateDate);
    const inventoryService = new InventoryService(userInfo, updateDate, inventoryLogDao);

    InventoryService.validModel(inventoryService);

    inventoryService.useItem(
        InventoryService.USE_ACTION.CHEAT, 
        { cheat: 'cheat' },
        reqCheatUseItem.getInventoryList());

    const inventory = await inventoryService.finalize();

    const userService = new UserService(userInfo, userDao, updateDate);
    userService.setInventory(inventory);

    await userService.finalize();

    ctx.$res.success({ inventory });
    
    await next();
}

/**
 * @swagger
 * resourcePath: /cheat
 * description: All about API
 */

/**
 * @swagger
 * path: /cheat/useItem
 * operations:
 *   -  httpMethod: POST
 *      summary: 치트 아이템 소비
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>useList: 인벤토리 리스트
 *      responseClass: resCheatUseItem
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqCheatUseItem
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqCheatUseItem:
 *     id: reqCheatUseItem
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       useList:
 *         type: array
 *         items: 
 *           type: inventory
 *         required: true
 *         description: 아이템 리스트
 *   resCheatUseItem:
 *     id: resCheatUseItem
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */