const ReqPurchaseKeyUpdate = require("@ss/models/controller/ReqPurchaseKeyUpdate");

const ProductService = require("@ss/service/ProductService");

module.exports = async (ctx, next) => {
  const reqPurchaseKeyUpdate = new ReqPurchaseKeyUpdate(ctx.request.body);
  ReqPurchaseKeyUpdate.validModel(reqPurchaseKeyUpdate);

  const logDate = ctx.$date;
  const userInfo = ctx.$userInfo;

  const productId = reqPurchaseKeyUpdate.getProductId();
  const orderId = reqPurchaseKeyUpdate.getOrderId();
  const purchaseKey = reqPurchaseKeyUpdate.getPurchaseKey();

  const productService = new ProductService(userInfo, logDate);
  const result = await productService.updateProductKey(productId, purchaseKey, orderId);

  ctx.$res.success({ result });

  await next();
};

