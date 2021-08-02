// 리딩 타운 가격인하로 
// 꿀 환불
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
const MailService = require('@ss/service/MailService');
const { MailSender } = require('@ss/util/ValidateUtil');

const readingTownTale = ['TheCreepyCaterpillar_en', 'CupcakesforGrandma_en'];

// 일반 스토리 kr로 변경
async function test() {
    const updateDate = moment().valueOf();
    const userDao = new UserDao(dbMongo);
    const userList = await userDao.findAll();

    for (const user of userList) {
        const userInfo = new User(user);
        const { uid, inventory } = userInfo;
        // 1. 아이템 보유 유저 추출
        const userReadingTown = []
        inventory.map((item) => {
            if (readingTownTale.includes(item.itemId)) userReadingTown.push(item);
        })

        if (userReadingTown.length === 0) continue;

        const mailService = new MailService(userInfo, updateDate);

        const itemInfo = {
            action: InventoryService.PUT_ACTION.READING_TOWN_PRICE_SALE,
        };

        const title = '리딩 타운 콘텐츠 가격인하'
        const message = `
안녕하세요. 스토리셀프 입니다.
언제나 저희 스토리셀프를 사랑해주셔서 감사드립니다.

유저님의 사랑에 보답하고자 리딩타운 콘텐츠의 가격을 기존 50꿀에서 20꿀로 대폭 인하하기로 결정하였습니다.
더불어 기존에 리딩타운을 구매하셨던 분들께는 차액만큼의 꿀을 지급해 드릴 예정이오니 이용에 참고 부탁드리겠습니다.

앞으로도 더욱 재미있고 좋은 동화로 찾아뵙도록 노력 하겠습니다.
감사합니다!`

        const sender = MailSender.ADMIN;
        const itemList = [{ itemId: "honey", itemQny: 30 * userReadingTown.length }]

        // const senderId = ''
        mailService.sendMail({ title, message, sender, itemList, itemInfo });
        const newMail = mailService.finalize();

        const userService = new UserService(userInfo, userDao, updateDate);
        userService.setMail(newMail);

        await userService.finalize();
    }
}







