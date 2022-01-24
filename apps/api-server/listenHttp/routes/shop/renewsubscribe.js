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

  const { subscribeInfo } = await productService.checkRenewReceipt();

  const userService = new UserService(userInfo, userDao, purchaseDate);

  userService.setSubscribeInfo(subscribeInfo);

  userService.finalize();

  productService.removeUnusedParams(subscribeInfo);

  ctx.$res.success({
    purchaseState: 0,
    subscribeInfo,
  });

  await next();
};
