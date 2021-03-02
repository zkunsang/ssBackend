const dbMongo = require('@ss/dbMongo');
const dbRedisSS = require('@ss/dbRedisSS');
const dbRedisPB = require('@ss/dbRedisPB');

const helper = require('@ss/helper');
const DateUtil = require('@ss/util/DateUtil');

const LoginLogDao = require("@ss/daoMongo/LoginLogDao");
const InvenLogDao = require("@ss/daoMongo/InvenLogDao");

const UserDao = require('@ss/daoMongo/UserDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
const StoryTempEventDao = require('@ss/daoMongo/StoryTempEventDao');
const SessionDao = require('@ss/daoRedis/SessionDao');
const UserCountDao = require('@ss/daoRedis/UserCountDao');
const EventDao = require('@ss/daoMongo/EventDao');

const InventoryService = require('@ss/service/InventoryService');

const User = require('@ss/models/mongo/User');
const Item = require('@ss/models/mongo/Item');
const Event = require('@ss/models/mongo/Event');

const UserStatus = require('@ss/util/ValidateUtil').UserStatus;
const ReqAuthLogin = require('@ss/models/controller/ReqAuthLogin');

const LoginLog = require('@ss/models/apilog/LoginLog');

const shortid = require('shortid');
const ArrayUtil = require('@ss/util/ArrayUtil');

module.exports = async (ctx, next) => {
    const loginDate = ctx.$date;
    const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
    if(!reqAuthLogin.getProvider() || !reqAuthLogin.getProviderId()) {
        ctx.$res.success({});
        return;
    }
    ReqAuthLogin.validModel(reqAuthLogin);

    const provider = reqAuthLogin.getProvider();
    const providerId = reqAuthLogin.getProviderId();
    
    const userDao = new UserDao(dbMongo);
    const sessionDao = new SessionDao(dbRedisSS);
    const inventoryDao = new InventoryDao(dbMongo);

    const providerInfo = {}
    providerInfo[provider] = providerId;

    let userInfo = await userDao.findOne(providerInfo);

    let policyVersion = userInfo ? userInfo.policyVersion : "0";
    const sessionId = shortid.generate();

    let isNewUser = false;
    
    let eventList = [];
    const itemList = [];

    if(dbRedisPB.betaEvent && dbRedisPB.betaEvent.status == 1) {
        eventList.push({ evtCode: dbRedisPB.betaEvent.evtCode, message: dbRedisPB.betaEvent.message });
    }

    if (userInfo) {
        const uid = userInfo.getUID();
        const oldSessionId = userInfo.getSessionId();
        
        userInfo.setSessionId(sessionId);
        userInfo.setLastLoginDate(loginDate);
        await userDao.updateOne({ uid }, { sessionId, lastLoginDate: loginDate });
        await sessionDao.del(oldSessionId);
        
        reqAuthLogin.uid = userInfo.getUID();

        // TODO: 이벤트 데이터
        const storyTempEventDao = new StoryTempEventDao(dbMongo);
        const eventInfo = await storyTempEventDao.findOne({ uid });

        const eventDao = new EventDao(dbMongo);
        const userEventInfo = await eventDao.findOne({ uid });

        // 유저 정보가 없고
        // 재접속이벤트 5001
        if( !userEventInfo ) {
            const createDate = userInfo.getCreateDate();   
            if (DateUtil.dsToUts("2021-03-02 12:00:00") > createDate / 1000) {
                itemList.push(InventoryService.makeInventoryObject('honey', 50))
                await eventDao.insertOne(new Event({ uid, eventInfo: { '5001': loginDate } }));
            }
        }

        // 이벤트 달성 했을때 
        eventList.push({ evtCode: 101, complete: eventInfo ? 1 : 0 });
    }
    else {
        isNewUser = true;

        const userCountDao = new UserCountDao(dbRedisSS);
        const userCountInfo = await userCountDao.incr();
        
        reqAuthLogin.uid = userCountInfo.toString();
        userInfo = new User(reqAuthLogin);
        userInfo.setStatus(UserStatus.NONE);
        userInfo.setSessionId(sessionId);
        userInfo.setLastLoginDate(loginDate);
        userInfo.setCreateDate(loginDate);
        userInfo.setProvider(provider, providerId);

        await userDao.insertOne(userInfo);

        eventList.push({ evtCode: 101, complete: 0 });
    }
    const invenLogDao = new InvenLogDao(dbMongo, loginDate);
    const inventoryService = new InventoryService(inventoryDao, userInfo, loginDate, invenLogDao);

    const userInventoryList = await inventoryService.getUserInventoryList();

    if(isNewUser || itemList.length > 0) {
        await processUserInitInventory(inventoryService, userInventoryList, itemList);
    }

    const fcmToken = userInfo.fcmToken;

    sessionDao.set(sessionId, userInfo);
    
    InventoryService.removeObjectIdList(userInventoryList);

    ctx.$res.success({ 
        sessionId,
        inventoryList: userInventoryList,
        policyVersion,
        fcmToken,
        eventList
    });

    const loginLog = new LoginLog(reqAuthLogin, { ip: ctx.$req.clientIp, loginDate });
    helper.fluent.sendLog('login', loginLog);

    const loginLogDao = new LoginLogDao(dbMongo, loginDate);
    await loginLogDao.insertOne(loginLog);

    await next();
};

async function processUserInitInventory(inventoryService, userInventoryList, itemList) {
    // pictureSlot아이템이 존재 하지 않으면 제공
    await processLoginPictureSlot(inventoryService, userInventoryList, itemList);
}

async function processLoginPictureSlot(inventoryService, userInventoryList, itemList = []) {
    const invenMap = ArrayUtil.getMapArrayByKey(userInventoryList, Item.Schema.ITEM_ID.key);
    
    const pictureSlotList = invenMap['pictureSlot'];
    if(!pictureSlotList) { 
        const pictureSlot = InventoryService.makeInventoryObject('pictureSlot', 1);
        itemList.push(pictureSlot);
    }

    const honeySlotList = invenMap['honey'];

    if(!honeySlotList) { 
        const honey = InventoryService.makeInventoryObject('honey', 25);
        itemList.push(honey);
    }

    const goldilocksList = invenMap['PussInBoots'];

    if(!goldilocksList) { 
        const goldi = InventoryService.makeInventoryObject('PussInBoots', 1);
        itemList.push(goldi);
    }

    if(itemList.length == 0) return;
    
    await inventoryService.processPut(
        InventoryService.PUT_ACTION.USER_INIT, 
        itemList);

    for(const item of itemList) {
        userInventoryList.push(item);
    }
}
/**
 * @swagger
 * resourcePath: /auth
 * description: All about API
 */

/**
 * @swagger
 * path: /auth/login
 * operations:
 *   -  httpMethod: POST
 *      summary: 로그인
 *      notes: |
 *        <br>uid (String): 파이어 베이스에서 획득한 uid,
 *        <br>email (Email),
 *        <br>provider (String): 로그인 방법(google|facebook|email),
 *        <br>deviceId (number),
 *        <br>platform (String): 플랫폼(ios|aos) aos - android os,
 *        <br>appStore (String): 스토어(google|onestore|appstore),
 *        <br>clientVersion (String): 클라이언트 앱 버젼입니다.
 * 
 *      responseClass: resAuthLogin
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqLogin
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqLogin:
 *     id: reqLogin
 *     properties:
 *       uid:
 *         type: String
 *         required: true
 *         description: 파이어 베이스에서 획득한 uid
 *       email:
 *         type: Email
 *         required: true
 *       provider:
 *         type: String
 *         required: true
 *         description: 로그인 방법(google|facebook|email)
 *       deviceId:
 *         type: number
 *         required: true
 *       platform:
 *         type: String
 *         required: true
 *         description: 플랫폼(ios|aos) aos - android os
 *       appStore:
 *         type: String
 *         required: true
 *         description: 스토어(google|onestore|appstore)
 *       clientVersion:
 *         type: String
 *         required: true
 *         description: 클라이언트 앱 버젼입니다.
 *   resAuthLogin:
 *     id: resAuthLogin
 *     properties:
 *       common:
 *         type: common 
 *       error:
 *         type: error
 *       data:
 *         type: data
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
 *
 * */