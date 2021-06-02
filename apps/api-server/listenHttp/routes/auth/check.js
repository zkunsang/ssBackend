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

    const checkKey = `${platform}_${clientVersion}`;

    const checkValue = ServiceVariableCache.get(checkKey);
    if (!checkValue) {
        return ctx.$res.success({});
    }

    const serverMessage = checkValue.value;

    ctx.$res.success({ serverMessage });

    await next();

}

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