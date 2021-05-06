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
const UserService = require("@ss/service/UserService");

// 일반 스토리 kr로 변경
async function test() {
    const updateDate = moment().valueOf();
    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findAll();
    for (const user of userList) {
        const userInfo = user;

        const userService = new UserService(userInfo, userDao, updateDate);
        userService.setMail([]);

        await userService.finalize();
    }
}










