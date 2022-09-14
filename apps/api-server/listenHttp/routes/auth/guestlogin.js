const dbMongo = require("@ss/dbMongo");
const dbRedisSS = require("@ss/dbRedisSS");

const SessionDao = require("@ss/daoRedis/SessionDao");
const UserDao = require("@ss/daoMongo/UserDao");

const UserService = require("@ss/service/UserService");
const AuthService = require("@ss/service/AuthService");
const ReqAuthLogin = require("@ss/models/controller/ReqAuthLogin");

const { loginProcess } = require("@ss/helper/LoginHelper");

const shortid = require("shortid");

module.exports = async (ctx, next) => {
  const loginDate = ctx.$date;
  const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
  const ip = ctx.$req.clientIp;

  ReqAuthLogin.validModel(reqAuthLogin);

  const userDao = new UserDao(dbMongo);
  const sessionDao = new SessionDao(dbRedisSS);
  const authService = new AuthService(reqAuthLogin, ip, loginDate);

  let userInfo = await authService.findUser(userDao);
  
  let userService = null;
  if(userInfo == null) {
    const deviceId = reqAuthLogin.getDeviceId();
    if(!!deviceId) {
      userInfo = await authService.findUserByDeviceId(userDao, deviceId);
    }
    
    userService = new UserService(userInfo, userDao, loginDate);
    if(!!userInfo) {
      userService.setEtcUserMigration(reqAuthLogin.provider, reqAuthLogin.providerId);
      // userService.setEtcUserMigration();
    }
  }
  else {
    userService = new UserService(userInfo, userDao, loginDate);
  }
  
  const sessionId = shortid.generate();

  if (userInfo) {
    const oldSessionId = authService.login(userInfo, sessionId);
  } else {
    userInfo = await authService.signIn(sessionId);
    userService.setUserInfo(userInfo);
  }

  await loginProcess(userInfo, loginDate, userService, authService, sessionDao, sessionId, ctx);

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
