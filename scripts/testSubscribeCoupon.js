// 스토리에 lang을 추가하는 작업 _kr을 붙여주는 작업
// NODE_ENV=apiDev node ./scripts/testSubscribe.js

process.on('uncaughtException', (err) => console.error(err));
require('./startup');

const moment = require("moment");

(async () => {
  try {
    await require('./boot/initSS')();
    await test();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();


const dbMongo = require('@ss/dbMongo');
const UserDao = require('@ss/daoMongo/UserDao');
const UserService = require("@ss/service/UserService");
const ReceiptDao = require('@ss/daoMongo/ReceiptDao');
const SubscribeReceiptDao = require('@ss/daoMongo/SubscribeReceiptDao');
const ProductService = require('@ss/service/ProductService');
const receiptData = require("../scripts/revokereceipt12.json");

// 일반 스토리 kr로 변경
async function test() {
  console.log(receiptData);
  const updateDate = moment().valueOf();
  const userDao = new UserDao(dbMongo);
 
  const userList = await userDao.findMany({ "subscriberId": "TSUBS_202110" });

  for(const user of userList) {
    const subscribeInfo = {
      couponId: "SUBS_365_01",
      expiryTimeMillis: 1672531200000,
      cancelled: false
    }

    const userService = new UserService(user, userDao, updateDate);
    userService.setSubscribeCoupon(subscribeInfo);
    await userService.finalize();
  }
}










