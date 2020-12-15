const dbRedis = require('@ss/dbRedisSS');

const SessionDao = require('@ss/daoRedis/SessionDao');
const ReqAuthLogout = require('@ss/models/controller/ReqAuthLogout');

module.exports = async (ctx, next) => {
    const sessionDao = new SessionDao(dbRedis);
    const reqAuthLogout = new ReqAuthLogout(ctx.request.body);
    ReqAuthLogout.validModel(reqAuthLogout);

    await sessionDao.del(reqAuthLogout.getSessionId());

    ctx.status = 200;
    ctx.body.data = {};

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