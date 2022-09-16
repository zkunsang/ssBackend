const UserResourceService = require("@ss/service/UserResourceService");
const DataTableCache = require('@ss/dbCache/DataTableCache');
const ServiceVariableCache = require('@ss/dbCache/ServiceVariableCache');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');
const VariableKey = ServiceVariable.VariableKey;

const ss = require("@ss");
const apiConfig = ss.configs.apiServer;

module.exports = async (ctx, next) => {
  const userInfo = ctx.$userInfo;
  const updateDate = ctx.$date;

  const userResourceService = new UserResourceService(userInfo, updateDate);
  const modelList = await userResourceService.checkModel();
  const scriptList = await userResourceService.checkScript();
  const stickerList = await userResourceService.checkCustomSticker();
  const userPlayDataMeta = await userResourceService.checkUserPlayData();

  const dataTableList = DataTableCache.getList();
  const couponEnable = JSON.parse(
    ServiceVariableCache.get(VariableKey.couponEnable).value
  );

  const s3Url = apiConfig.cdnUrl;
  const s3UserUrl = apiConfig.cdnUserUrl;
  const modelVersion = apiConfig.modelVersion;

  ctx.$res.success({
    dataTableList,
    s3Url,
    couponEnable,
    s3UserUrl,
    modelVersion,
    modelList,
    scriptList,
    stickerList,
    userPlayDataMeta
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
