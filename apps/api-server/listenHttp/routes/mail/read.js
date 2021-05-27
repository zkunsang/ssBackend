const ReqMailRead = require('@ss/models/controller/ReqMailRead');

const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');
const MailService = require('@ss/service/MailService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const reqCheatReadMail = new ReqMailRead(ctx.request.body);
    ReqMailRead.validModel(reqCheatReadMail);

    const mailId = reqCheatReadMail.getMailId();

    const mailService = new MailService(userInfo, updateDate);

    const { userMail, itemList, itemInfo } = mailService.readMail(mailId);

    const userService = new UserService(userInfo, userDao, updateDate);
    const inventoryService = new InventoryService(userInfo, updateDate);

    if (itemList.length > 0) {
        const { action, addInfo } = itemInfo;
        const putItem = inventoryService.putItem(action, addInfo, itemList);

        const cheatPutHistory = inventoryService.createPutHoneyHistory(putItem, action);
        userService.addHoneyHistory(cheatPutHistory);
        ctx.$res.addData({ honeyHistory: userService.getHoneyHistory() });
    }

    const inventory = inventoryService.finalize();

    userService.setInventory(inventory);
    userService.setMail(userMail);

    mailService.finalize();
    await userService.finalize();

    ctx.$res.success({
        mail: Object.values(userMail),
        inventory
    });

    await next();
}
