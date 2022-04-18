// 리딩 타운 가격인하로
// 꿀 환불
process.on("uncaughtException", (err) => console.error(err));
require("./startup");

const moment = require("moment");

(async () => {
  try {
    await require("./boot/initSS")();
    await test();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();

const dbMongo = require("@ss/dbMongo");
const UserDao = require("@ss/daoMongo/UserDao");
const User = require("@ss/models/mongo/User");
const InventoryService = require("@ss/service/InventoryService");
const UserService = require("@ss/service/UserService");
const MailService = require("@ss/service/MailService");
const { MailSender } = require("@ss/util/ValidateUtil");

const readingTownTale = ["TheCreepyCaterpillar_en", "CupcakesforGrandma_en"];

// 일반 스토리 kr로 변경
async function test() {
  const updateDate = moment().valueOf();
  const userDao = new UserDao(dbMongo);
  const user = await userDao.findOne({ uid: "9214" });

  const userInfo = new User(user);
  const mailService = new MailService(userInfo, updateDate);

  const itemInfo = {
    action: InventoryService.PUT_ACTION.ADMIN,
  };

  const title = "스토리 셀프 500꿀을 드립니다.";
  const message = `서비스 이용에 불편을 드려 죄송합니다.`;
  const title_en = "스토리 셀프 500꿀을 드립니다.";
  const message_en = `서비스 이용에 불편을 드려 죄송합니다.`;

  const sender = MailSender.ADMIN;
  const itemList = [{ itemId: "honey", itemQny: 500 }];

  // const senderId = ''
  mailService.sendMail({
    title,
    title_en,
    message,
    message_en,
    sender,
    itemList,
    itemInfo,
  });
  const newMail = mailService.finalize();

  const userService = new UserService(userInfo, userDao, updateDate);
  userService.setMail(newMail);

  await userService.finalize();
}
