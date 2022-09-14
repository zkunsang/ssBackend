const SSError = require('@ss/error');
const UserService = require('@ss/service/UserService');
const ProductService = require('@ss/service/ProductService');
const UserResourceService = require('@ss/service/UserResourceService');

module.exports = async (ctx, next) => {
  const updateDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  if(!userInfo.linkedUID) {
    ctx.$res.badRequest(SSError.Service.Code.noLinkedUID);
    await next();
    return;
  }

  const userService = new UserService(userInfo, userDao, updateDate);
  const linkedUserInfo = await userService.findUserWithUID(userInfo.linkedUID);

  sessionDao.set(sessionId, {...linkedUserInfo, ktUser: true});

  const productService = new ProductService(linkedUserInfo, updateDate);
  const { subscribeInfo } = await productService.checkRenewReceipt();

  const userResourceService = new UserResourceService(linkedUserInfo, updateDate);
  const modelList = await userResourceService.checkModel();
  const scriptList = await userResourceService.checkScript();
  const stickerList = await userResourceService.checkCustomSticker();
  const userPlayDataMeta = await userResourceService.checkUserPlayData();

  ctx.$res.success({
    sessionId,
    puid: linkedUserInfo.puid,
    mail: linkedUserInfo.getMailList(),
    inventory: linkedUserInfo.getInventory(),
    honeyHistory: linkedUserInfo.getHoneyHistory(),
    productPurchase: linkedUserInfo.getProductPurhcase(),
    feedback: linkedUserInfo.getFeedback(),
    subscriber: linkedUserInfo.getSubscriber(),
    subscribeCoupon: linkedUserInfo.getSubscribeCoupon(),
    subscribeInfo,
    modelList,
    scriptList,
    stickerList,
    userPlayDataMeta
  });
  await next();

}
