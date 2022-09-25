const ReqQRConfirm = require('@ss/models/controller/qr/ReqQRConfirm');
const UserService = require('@ss/service/UserService');

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

  const userService = new UserService(userInfo, userDao, updateDate);
  await userService.linkUser(ktUserInfo);
  await qrDao.del(confirmKey);

  ctx.$res.success({});

  await next();
}
