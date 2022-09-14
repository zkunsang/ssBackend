const dbRedisSS = require('@ss/dbRedisSS');
const QRDao = require("@ss/daoRedis/QRDao");

module.exports = async (ctx, next) => {
  // TODO: 너무 많이 시도할 경우
  // TODO: Log작업

  const userInfo = ctx.$userInfo;

  const qrDao = new QRDao(dbRedisSS);

  const confirmKey = Math.floor(100000 + Math.random() * 900000);

  qrDao.set(confirmKey, userInfo);

  ctx.$res.success({ confirmKey });

  await next();
}
