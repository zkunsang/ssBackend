const ss = require('@ss');
const ReqUserPlaydata = require('@ss/models/controller/user/ReqUserPlaydata');
const UserResourceService = require("@ss/service/UserResourceService");

module.exports = async (ctx, next) => {
  const reqUserPlaydata = new ReqUserPlaydata(ctx.request.body);
  ReqUserPlaydata.validModel(reqUserPlaydata);

  const userInfo = ctx.$userInfo;
  const updateDate = ctx.$date;

  const userResourceService = new UserResourceService(userInfo, updateDate);

  const userPlayDataMeta = await userResourceService.updatePlaydata(
    reqUserPlaydata
  );

  await userResourceService.finalize();

  ctx.$res.success({ userPlayDataMeta });

  await next();
};

/**
 * @swagger
 * resourcePath: /user
 * description: All about API
 */

/**
 * @swagger
 * path: /user/policyVersion
 * operations:
 *   -  httpMethod: POST
 *      summary: 개인 정보 보호 정책 수락
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resPolicyVersion
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqUserPolicyVersion
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqUserPolicyVersion:
 *     id: reqUserPolicyVersion
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       policyVersion:
 *         type: Number
 *         required: true
 *         description: 개인정보 버젼
 *   resPolicyVersion:
 *     id: resPolicyVersion
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
 *
 * */