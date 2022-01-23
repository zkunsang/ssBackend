const dbMongo = require("@ss/dbMongo");
const dbRedisSS = require("@ss/dbRedisSS");

const SessionDao = require("@ss/daoRedis/SessionDao");
const UserDao = require("@ss/daoMongo/UserDao");

const InventoryService = require("@ss/service/InventoryService");
const UserService = require("@ss/service/UserService");
const AuthService = require("@ss/service/AuthService");
const EventService = require("@ss/service/EventService");
const MailService = require("@ss/service/MailService");
const QuestService = require("@ss/service/QuestService");
const ProductService = require("@ss/service/ProductService");

const ReqAuthLogin = require("@ss/models/controller/ReqAuthLogin");
const Inventory = require("@ss/models/mongo/Inventory");

const shortid = require("shortid");
const ArrayUtil = require("@ss/util/ArrayUtil");

module.exports = async (ctx, next) => {
  const loginDate = ctx.$date;
  const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
  const ip = ctx.$req.clientIp;

  console.log("reqAuthLogin - ", reqAuthLogin);
  ReqAuthLogin.validModel(reqAuthLogin);
  // reqAuthLogin.blockIOS();

  const userDao = new UserDao(dbMongo);
  const sessionDao = new SessionDao(dbRedisSS);
  const authService = new AuthService(reqAuthLogin, ip, loginDate);

  let userInfo = await authService.findUser(userDao);
  const userService = new UserService(userInfo, userDao, loginDate);

  const sessionId = shortid.generate();

  if (userInfo) {
    const oldSessionId = authService.login(userInfo, sessionId);
    // 다른 디바이스에서 로그인 처리 이슈로 주석
    // await sessionDao.del(oldSessionId);
  } else {
    userInfo = await authService.signIn(sessionId);
    userService.setUserInfo(userInfo);
  }

  const eventService = new EventService(userInfo, loginDate);
  const inventoryService = new InventoryService(userInfo, loginDate);
  const mailService = new MailService(userInfo, loginDate);

  let isNewUser = false;

  if (userService.isNewUser()) {
    const itemList = eventService.newUserEvent();
    const putItem = inventoryService.putItem(
      InventoryService.PUT_ACTION.USER_INIT,
      {},
      ArrayUtil.map(itemList, (item) => new Inventory(item))
    );

    const initHoneyHistory = inventoryService.createPutHoneyHistory(
      putItem,
      InventoryService.PUT_ACTION.USER_INIT
    );
    userService.addHoneyHistory(initHoneyHistory);
    isNewUser = true;
  }

  const eventResult = await eventService.checkEvent();

  const { eventItemList, eventMailList } = eventResult || {};

  // inventoryService.putEventItemList(eventItemList, InventoryService.PUT_ACTION.EVENT.EVENT);

  const mail = mailService.putEventMailList(eventMailList);
  if (mail) userService.setMail(mail);

  const smc = inventoryService.checkStoryMerge();
  userService.setSMC(smc);

  const userInventory = inventoryService.finalize();
  userService.setInventory(userInventory);

  const productService = new ProductService(userInfo, loginDate);
  const { subscribeInfo } = await productService.checkRenewReceipt();

  if (userService.setSubscribeInfo(subscribeInfo)) {
    productService.finalize();
  }

  await eventService.finalize();
  await userService.finalize();
  authService.finalize(userInfo.uid);

  const { fcmToken } = userInfo;
  const eventList = [];

  sessionDao.set(sessionId, userInfo);

  ctx.$userInfo = userInfo;
  const puid = userInfo.getPUID();

  ctx.$res.success({
    sessionId,
    puid,
    policyVersion: 1,
    fcmToken,
    eventList,
    mail: userService.getMailList(),
    inventory: userService.getInventory(),
    honeyHistory: userService.getHoneyHistory(),
    productPurchase: userService.getProductPurhcase(),
    isNewUser,
    feedback: userService.getFeedback(),
    subscriber: userService.getSubscriber(),
    subscribeInfo,
  });

  await next();
};

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
