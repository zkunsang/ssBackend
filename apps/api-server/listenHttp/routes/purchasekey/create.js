const ReqPurchaseKeyCreate = require("@ss/models/controller/ReqPurchaseKeyCreate");
const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const reqPurchaseKeyCreate = new ReqPurchaseKeyCreate(ctx.request.body);
  ReqPurchaseKeyCreate.validModel(reqPurchaseKeyCreate);

  const logDate = ctx.$date;
  const userInfo = ctx.$userInfo;

  const productId = reqPurchaseKeyCreate.getProductId();

  const productService = new ProductService(userInfo, logDate);
  const purchaseKey = await productService.createProductKey(productId);

  ctx.$res.success({ purchaseKey });

  await next();
};

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/accessory
 * operations:
 *   -  httpMethod: POST
 *      summary: 악세사리 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>itemId: 아이템 아이디
 *      responseClass: resShopAccessory
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqQuestCheck
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqQuestCheck:
 *     id: reqQuestCheck
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       itemId:
 *         type: String
 *         required: true
 *         description: 아이템 아이디
 *   resShopAccessory:
 *     id: resShopAccessory
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */
