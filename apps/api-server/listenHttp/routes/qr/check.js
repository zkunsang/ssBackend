const SSError = require('@ss/error');
const dbRedisSS = require('@ss/dbRedisSS');
const UserService = require('@ss/service/UserService');
const ProductService = require('@ss/service/ProductService');
const UserResourceService = require('@ss/service/UserResourceService');
const SessionDao = require('@ss/daoRedis/SessionDao');

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
  const sessionDao = new SessionDao(dbRedisSS);

  const sessionId = userInfo.sessionId;

  sessionDao.set(sessionId, {...linkedUserInfo, ktUser: true});

  const productService = new ProductService(linkedUserInfo, updateDate);
  const { subscribeInfo } = await productService.checkRenewReceipt();

  const userResourceService = new UserResourceService(linkedUserInfo, updateDate);
  const modelList = await userResourceService.checkModel();
  const scriptList = await userResourceService.checkScript();
  const stickerList = await userResourceService.checkCustomSticker();
  const userPlayDataMeta = await userResourceService.checkUserPlayData();

  const linkedUserService = new UserService(linkedUserInfo, userDao, updateDate);

  const linkedUser = true;

  ctx.$res.success({
    sessionId,
    puid: linkedUserInfo.puid,
    mail: linkedUserService.getMailList(),
    inventory: linkedUserService.getInventory(),
    honeyHistory: linkedUserService.getHoneyHistory(),
    productPurchase: linkedUserService.getProductPurhcase(),
    feedback: linkedUserService.getFeedback(),
    subscriber: linkedUserService.getSubscriber(),
    subscribeCoupon: linkedUserService.getSubscribeCoupon(),
    subscribeInfo,
    modelList,
    scriptList,
    stickerList,
    userPlayDataMeta,
    linkedUser
  });
  await next();

}
