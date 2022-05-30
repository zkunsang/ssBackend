const ReqLogCustomSticker = require('@ss/models/controller/log/ReqLogCustomSticker');

const LogService = require('@ss/service/LogService');

module.exports = async (ctx, next) => {
    const reqLogCustomSticker = new ReqLogCustomSticker(ctx.request.body);
    ReqLogCustomSticker.validModel(reqLogCustomSticker);

    const userInfo = ctx.$userInfo;
    const logDate = ctx.$date;

    const logService = new LogService(userInfo, logDate);
    logService.sendCustomStickerLog(reqLogCustomSticker);

    ctx.$res.success({});
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