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

// 기존 inventoryDao를 사용하던것을 userDao 하나로 통합
async function test() {
    const updateDate = moment().valueOf();
    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findAll();
    for (const user of userList) {
        const uid = user.uid;
        const inventory = [];
        const userInfo = { uid, inventory };

        const userService = new UserService(userInfo, userDao, updateDate);
        const inventoryService = new InventoryService(userInfo, updateDate);
        await inventoryService.checkWrongInventory();
        const userInventory = inventoryService.finalize();
        userService.setInventory(userInventory);

        await userService.finalize();
    }
}