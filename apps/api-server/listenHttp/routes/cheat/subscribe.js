const ReqCheatPurchase = require("@ss/models/controller/ReqCheatPurchase");
const SubscribeInfo = require("@ss/models/mongo/SubscribeInfo");

const UserService = require("@ss/service/UserService");
const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const purchaseDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const reqCheatPurchase = new ReqCheatPurchase(ctx.request.body);
  ReqCheatPurchase.validModel(reqCheatPurchase);

  const appStore = "etc";
  const productId = reqCheatPurchase.getProductId();
  const packageName = reqCheatPurchase.getPackageName();

  const productService = new ProductService(userInfo, purchaseDate);

  const { subscribeInfo } = await productService.validateSubscription(
    new SubscribeInfo({
      appStore,
      productId,
      packageName,
    })
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
