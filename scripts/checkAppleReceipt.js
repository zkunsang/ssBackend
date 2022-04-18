// 스토리에 lang을 추가하는 작업 _kr을 붙여주는 작업

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
const ProductService = require('@ss/service/ProductService');
const receiptData = require("../scripts/checkReceipt.json");

// 일반 스토리 kr로 변경
async function test() {
  const updateDate = moment().unix();
  const user = {"uid": "123"};

  console.log(receiptData);

  const productService = new ProductService(user, updateDate);
  const subscribeInfo = await productService.validateSubscriptionApple(receiptData);

  console.log(subscribeInfo);
}










