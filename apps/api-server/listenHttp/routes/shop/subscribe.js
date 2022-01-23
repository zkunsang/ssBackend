const ReqShopSubscribe = require("@ss/models/controller/ReqShopSubscribe");

const SSError = require("@ss/error");
const ValidateUtil = require("@ss/util/ValidateUtil");
const PurchaseStatus = ValidateUtil.PurchaseStatus;

const UserService = require("@ss/service/UserService");
const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const purchaseDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const reqShopSubscribe = new ReqShopSubscribe(ctx.request.body);
  ReqShopSubscribe.validModel(reqShopSubscribe);

  const productService = new ProductService(userInfo, purchaseDate);

  const { receipt, subscribeInfo } = await productService.validateSubscription(
    reqShopSubscribe
  );

  const userService = new UserService(userInfo, userDao, purchaseDate);

  userService.setSubscribeInfo(subscribeInfo);

  userService.finalize();
  productService.finalize();

  ctx.$res.success({
    purchaseState: 0,
    subscribeInfo,
  });

  await next();
};

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/product
 * operations:
 *   -  httpMethod: POST
 *      summary: 상품 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>receipt: 영수증
 *        <br>appStore (String): 스토어(google|onestore|appstore),
 *      responseClass: resShopPurchase
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqShopPurchase
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopPurchase:
 *     id: reqShopPurchase
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       receipt:
 *         type: String
 *         required: true
 *         description: 영수증
 *       appStore:
 *         type: String
 *         required: true
 *         description: 앱스토어
 *   resShopPurchase:
 *     id: resShopPurchase
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */
