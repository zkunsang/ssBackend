// kr, en을 book으로 합칠때 잘못된 아이템 아이디 수정

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
const User = require('@ss/models/mongo/User');
const InventoryService = require("@ss/service/InventoryService");
const UserService = require("@ss/service/UserService");
const StoryCache = require('@ss/dbCache/StoryCache');
const ItemCache = require('@ss/dbCache/ItemCache');

// 일반 스토리 kr로 변경
async function test() {
  const updateDate = moment().valueOf();
  const storyList = StoryCache.getList();

  // 스토리 아이디 가져오기
  const userDao = new UserDao(dbMongo);
  const userList = await userDao.findAll();
  for (const user of userList) {
    const { uid, inventory } = user;

    // if (uid !== "340") continue;
    const newInventory = [];

    let needUpdate = false;

    for (let i = 0; i < inventory.length; i++) {
      const itemData = ItemCache.get(inventory[i].itemId);

      if (!itemData) {
        console.log(`file delete - ${inventory[i].itemId}`);
        continue;
      }

      needUpdate = true;
      newInventory.push(inventory[i]);
    }

    if (!needUpdate) continue;

    console.log("!update");
    const userService = new UserService(user, userDao, updateDate);
    userService.setInventory(newInventory);
    userService.setPageSticker([]);

    await userService.finalize();
  }
}










