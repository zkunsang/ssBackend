const ReqPurchaseKeyGet = require("@ss/models/controller/ReqPurchaseKeyGet");

const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const reqPurchaseKeyGet = new ReqPurchaseKeyGet(ctx.request.body);
  ReqPurchaseKeyGet.validModel(reqPurchaseKeyGet);

  const logDate = ctx.$date;
  const userInfo = ctx.$userInfo;

  const productId = reqPurchaseKeyGet.getProductId();

  const productService = new ProductService(userInfo, logDate);
  const purchaseKey = await productService.getProductKey(productId);

  ctx.$res.success({ purchaseKey });

  await next();
};

