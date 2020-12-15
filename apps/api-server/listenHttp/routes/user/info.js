
const ReqUserInfo = require('@ss/models/controller/ReqUserInfo');
const InventoryDao = require('@ss/daoMongo/InventoryDao');


module.exports = async (ctx, next) => {
    const reqUserInfo = new ReqUserInfo(ctx.request.body);
    ReqUserInfo.validModel(reqUserInfo);

    const dbMongo = ctx.$dbMongo;
    const userInfo = ctx.$userInfo;

    const uid = userInfo.getUID();

    const inventoryDao = new InventoryDao(dbMongo);
    const inventoryList = await inventoryDao.findMany({uid});

    ctx.status = 200;
    ctx.body.data = { inventoryList };

    await next();
};

/**
 * @swagger
 * resourcePath: /user
 * description: All about API
 */

/**
 * @swagger
 * path: /user/info
 * operations:
 *   -  httpMethod: POST
 *      summary: 유저 인포
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디 
 *      responseClass: resUserInfo
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqUserInfo
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqUserInfo:
 *     id: reqUserInfo
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *   resUserInfo:
 *     id: resUserInfo
 *     properties:
 *       inventoryList:
 *         type: array
 *         items: 
 *           type: inventory
 *   inventory:
 *     id: inventory
 *     properties:
 *       itemId: 
 *         type: String
 *       itemQny:
 *         type: number
 *       createDate:
 *         type: number
 *       updateDate:
 *         type: number
 *       endDate:
 *         type: number
 * 
 * */