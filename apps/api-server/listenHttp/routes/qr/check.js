const QRDao = require("@ss/daoRedis/QRDao");
const SSError = require('@ss/error');
const dbRedisSS = require('@ss/dbRedisSS');
const dbMongo = require('@ss/dbMongo');
const UserDao = require('@ss/daoMongo/UserDao');

const UserService = require('@ss/service/UserService');
const ProductService = require('@ss/service/ProductService');
const UserResourceService = require('@ss/service/UserResourceService');
const SessionDao = require('@ss/daoRedis/SessionDao');
const ReqQRConfirm = require('@ss/models/controller/qr/ReqQRConfirm');

module.exports = async (ctx, next) => {
  const updateDate = ctx.$date;
  let userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const ktUID = userInfo.ktUID;

  const reqQRConfirm = new ReqQRConfirm(ctx.request.body);
  ReqQRConfirm.validModel(reqQRConfirm);

  const confirmKey = reqQRConfirm.getConfirmKey();

  const qrDao = new QRDao(dbRedisSS);
  const confirmInfo = await qrDao.get(confirmKey);

  if(!!confirmInfo) {
    ctx.$res.badRequest(SSError.Service.Code.notConfirmYet);
      await next();
      return;
  }

  if(!!ktUID) {
    const userDao = new UserDao(dbMongo);
    const sourceUserInfo = await userDao.findOne({ uid: ktUID });  

    if(!sourceUserInfo) {
      ctx.$res.badRequest(SSError.Service.Code.noLinkedUID);
      await next();
      return;
    }

    userInfo = sourceUserInfo;
  }

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
  const aiStickerList = await userResourceService.checkAISticker();

  const linkedUserService = new UserService(linkedUserInfo, userDao, updateDate);

  const linkedUser = true;

  ctx.$res.success({
    sessionId,
    email: linkedUserInfo.email,
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
    aiStickerList,
    userPlayDataMeta,
    linkedUser
  });
  await next();

}
