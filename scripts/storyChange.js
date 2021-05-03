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
const User = require('@ss/models/mongo/User');
const InventoryService = require("@ss/service/InventoryService");
const UserService = require("@ss/service/UserService");

const storyMapping = {
    "Goldilocks": "Goldilocks_kr",
    "PussInBoots": "PussInBoots_kr",
    "sunandmoon": "sunandmoon_kr",
    "pinocchio": "pinocchio_kr",
    "nutcracker": "nutcracker_kr",
    "TheLittlePrince": "TheLittlePrince_kr",
    "PeterPan": "PeterPan_kr",
    "AliceInWonderland": "AliceInWonderland_kr",
    "snowsoup": "snowsoup_kr",
}
// 일반 스토리 kr로 변경
async function test() {
    const updateDate = moment().valueOf();
    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findAll();
    for (const user of userList) {
        const { uid, inventory } = user;
        if (uid !== "65") continue;

        inventory.map((item) => {
            if (storyMapping[item.itemId])
                item.itemId = storyMapping[item.itemId];
        })

        const userInfo = { uid, inventory };

        const userService = new UserService(userInfo, userDao, updateDate);
        userService.setInventory(inventory);

        await userService.finalize();
    }
}










