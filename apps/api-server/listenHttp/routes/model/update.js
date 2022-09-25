const ReqModelUpdate = require("@ss/models/controller/ReqModelUpdate");
const UserResourceService = require("@ss/service/UserResourceService");

module.exports = async (ctx, next) => {
  const reqModelUpdate = new ReqModelUpdate(ctx.request.body);

  const userInfo = ctx.$userInfo;
  const updateDate = ctx.$date;

  const userResourceService = new UserResourceService(userInfo, updateDate);

  const finalModelList = await userResourceService.updateModel(
    reqModelUpdate
  );

  await userResourceService.finalize();

  ctx.$res.success({ modelList: finalModelList });

  await next();
};

/**
 * @swagger
 * resourcePath: /auth
 * description: All about API
 */

/**
 * @swagger
 * path: /auth/update
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
