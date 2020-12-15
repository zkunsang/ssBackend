const ss = require('@ss');
const apiConfig = ss.configs.apiServer;

module.exports = async (ctx, next) => {
    ctx.status = 200;
    ctx.body.data = {
        url: apiConfig.cdnUrl,
        version: apiConfig.appVersion,
        policyVersion: apiConfig.policyVersion
    };

    await next();
}

/**
 * @swagger
 * resourcePath: /config
 * description: All about API
 */

/**
 * @swagger
 * path: /config
 * operations:
 *   -  httpMethod: GET
 *      summary: 로비 진입전 앱에 필요한 기본 정보.
 *      notes: |
 *        <br>version: version
 *        <br>url: cdn주소입니다.
 *        <br>policyVersion: 개인 정책 버젼
 *      responseClass: appInfo
 *      nickname: config
 *      consumes:
 *        - text/html
 */

/**
 * @swagger
 * models:
 *   appInfo:
 *     id: AppInfo
 *     properties:
 *       version:
 *         type: String
 *         required: true
 *       url:
 *         type: String
 *         required: true
 *       policyVersion:
 *         type: String
 *         required: true
 */