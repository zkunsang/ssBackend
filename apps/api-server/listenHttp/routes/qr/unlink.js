const ReqQRConfirm = require('@ss/models/controller/qr/ReqQRConfirm');
const UserService = require('@ss/service/UserService');

const SSError = require('@ss/error');
const dbRedisSS = require('@ss/dbRedisSS');
const QRDao = require("@ss/daoRedis/QRDao");

module.exports = async (ctx, next) => {
  const updateDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const userService = new UserService(userInfo, userDao, updateDate);
  await userService.unlinkUser();

  ctx.$res.success({});

  await next();
}
