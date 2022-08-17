const ReqUserDelete = require("@ss/models/controller/user/ReqUserDelete");
const UserService = require("@ss/service/UserService");
const LogService = require("@ss/service/LogService");

module.exports = async (ctx, next) => {
  const reqUserDelete = new ReqUserDelete(ctx.request.body);

  const logDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const logService = new LogService(userInfo, logDate);
  logService.sendUserDeleteLog(reqUserDelete);

  const userService = new UserService(userInfo, userDao, logDate);
  userService.deleteUser();

  userService.finalize();
  ctx.$res.success({});

  await next();
};

/**
 * @swagger
 * resourcePath: /auth
 * description: All about API
 */

/**
 * @swagger
 * path: /auth/logout
 * operations:
 *   -  httpMethod: POST
 *      summary: 로그아웃
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resAuthLogout
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqAuthLogout
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqAuthLogout:
 *     id: reqAuthLogout
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *   resAuthLogout:
 *     id: resAuthLogout
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *
 * */
