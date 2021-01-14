const ReqLogPicture = require('@ss/models/controller/ReqLogPicture');

const PictureLogDao = require('@ss/daoMongo/PictureLogDao');
const PictureLog = require('@ss/models/apilog/PictureLog');

module.exports = async (ctx, next) => {
    const reqLogPicture = new ReqLogPicture(ctx.request.body);
    ReqLogPicture.validModel(reqLogPicture);
    const userInfo = ctx.$userInfo;
    
    const uid = userInfo.uid;
    const logDate = ctx.$date;
    const success = reqLogPicture.getSuccess();
    const debugLog = reqLogPicture.getDebugLog();
    const location = reqLogPicture.getLocation();
    
    const pictureLogDao = new PictureLogDao(ctx.$dbMongo, ctx.$date);
    pictureLogDao.insertOne(new PictureLog({ uid, success, debugLog, logDate, location }));
    
    ctx.status = 200;
    ctx.body.data = {  };

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