const SSError = require("@ss/error");
const ValidateUtil = require("@ss/util/ValidateUtil");
const PurchaseStatus = ValidateUtil.PurchaseStatus;

const UserService = require("@ss/service/UserService");
const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const purchaseDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const productService = new ProductService(userInfo, purchaseDate);

  const originSubscribeInfo = userInfo.getSubscribeInfo();

  const { subscribeInfo } = await productService.validateSubscription(
    originSubscribeInfo
  );

  const userService = new UserService(userInfo, userDao, purchaseDate);

  userService.setSubscribeInfo(subscribeInfo);

  userService.finalize();

  ctx.$res.success({
    purchaseState: 0,
    subscribeInfo,
  });

  await next();
};
