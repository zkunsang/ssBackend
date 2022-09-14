const ReqQRConfirm = require('@ss/models/controller/QR/ReqQRConfirm');

const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');
const MailService = require('@ss/service/MailService');

const SSError = require('@ss/error');

const dbRedisSS = require('@ss/dbRedisSS');
const QRDao = require("@ss/daoRedis/QRDao");

module.exports = async (ctx, next) => {
  const updateDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const reqQRConfirm = new ReqQRConfirm(ctx.request.body);
  ReqQRConfirm.validModel(reqQRConfirm);

  const confirmKey = reqQRConfirm.getConfirmKey();

  // 6자리 인지 확인
  if (confirmKey.length !== 6) {
    ctx.$res.badRequest(SSError.Service.Code.notValidConfirmKey);
    await next();
    return;
  }

  const qrDao = new QRDao(dbRedisSS);
  const ktUserInfo = await qrDao.get(confirmKey);

  if (ktUserInfo === null) {
    ctx.$res.badRequest(SSError.Service.Code.noExistConfirmKey);
    await next();
    return;
  }

  // kt에서 가입된 유저 정보
  // link를 해야 함
  // kt유저 정보에는 linked된 puid를 입력
  // 만약 
  
  // confirmKey에 대한 것에 flag를 걸어줘서 
  // kt앱에서 check를 통해 어떤 제대로 동작했는지를 판단.

  const userService = new UserService(userInfo, userDao, updateDate);
  await userService.linkUser(ktUserInfo);
  await qrDao.del(confirmKey);

  ctx.$res.success({});

  await next();
}
