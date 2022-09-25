const dbRedisSS = require('@ss/dbRedisSS');
const dbMongo = require('@ss/dbMongo');

const QRDao = require("@ss/daoRedis/QRDao");
const UserDao = require("@ss/daoMongo/UserDao");

module.exports = async (ctx, next) => {
  // TODO: 너무 많이 시도할 경우
  // TODO: Log작업
  const userInfo = ctx.$userInfo;

  const qrDao = new QRDao(dbRedisSS);

  const confirmKey = Math.floor(100000 + Math.random() * 900000);
  
  const ktUID = userInfo.ktUID;
  if(!!ktUID) {
    const userDao = new UserDao(dbMongo);
    const sourceUserInfo = await userDao.findOne({ uid: ktUID });  
    qrDao.set(confirmKey, sourceUserInfo);
  } else {
    qrDao.set(confirmKey, userInfo);
  }

  ctx.$res.success({ confirmKey });

  await next();
}
