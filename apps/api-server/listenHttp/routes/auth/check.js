const ss = require('@ss');
const apiConfig = ss.configs.apiServer;

const DataTableCache = require('@ss/dbCache/DataTableCache');
const ServiceVariableCache = require('@ss/dbCache/ServiceVariableCache');

const ServiceVariable = require('@ss/models/mongo/ServiceVariable');
const VariableKey = ServiceVariable.VariableKey;

const ReqAuthCheck = require('@ss/models/controller/ReqAuthCheck');

module.exports = async (ctx, next) => {
    // 데이터 버젼 테이블만 내려 받는 형식으로 변경
    const reqAuthCheck = new ReqAuthCheck(ctx.request.body);
    const clientVersion = reqAuthCheck.getClientVersion();
    const platform = reqAuthCheck.getPlatform();

    const serverMessageKey = `${platform}_${clientVersion}_servermessage`;

    const serveMessageValue = ServiceVariableCache.get(serverMessageKey);
    if (serveMessageValue) {
        const serverMessage = serveMessageValue.value;
        ctx.$res.addData({ serverMessage });
    }

    const couponEnableKey = `${platform}_${clientVersion}_couponenable`;
    const couponEnableValue = ServiceVariableCache.get(couponEnableKey);
    if (couponEnableValue) {
        const couponEnable = couponEnableValue.value;
        ctx.$res.addData({ couponEnable });
    }

    ctx.$res.success();

    await next();
}

/**
 * @swagger
 * resourcePath: /auth
 * description: All about API
 */

/**
 * @swagger
 * path: /auth/check
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