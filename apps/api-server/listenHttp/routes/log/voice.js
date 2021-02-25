const ReqLogVoice = require('@ss/models/controller/ReqLogVoice');

const VoiceLogDao = require('@ss/daoMongo/VoiceLogDao');
const VoiceLog = require('@ss/models/apilog/VoiceLog');

module.exports = async (ctx, next) => {
    const reqLogVoice = new ReqLogVoice(ctx.request.body);
    ReqLogVoice.validModel(reqLogVoice);
    const userInfo = ctx.$userInfo;
    
    const uid = userInfo.uid;
    const logDate = ctx.$date;

    const storyId = reqLogVoice.getStoryId();
    const soundIndex = reqLogVoice.getSoundIndex();
    const sceneIndex = reqLogVoice.getSceneIndex();
    const length = reqLogVoice.getLength();

    const voiceLogDao = new VoiceLogDao(ctx.$dbMongo, ctx.$date);
    voiceLogDao.insertOne(new VoiceLog({ uid, logDate, storyId, soundIndex, sceneIndex, length }));
    
    ctx.$res.success();
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