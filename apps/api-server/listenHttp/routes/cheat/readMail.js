const ReqCheatReadMail = require('@ss/models/controller/ReqCheatReadMail');

const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');
const MailService = require('@ss/service/MailService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;
    
    const reqCheatReadMail = new ReqCheatReadMail(ctx.request.body);
    ReqCheatReadMail.validModel(reqCheatReadMail);

    const mailId = reqCheatReadMail.getMailId();

    const mailService = new MailService(userInfo, updateDate);

    const { userMail, itemList, itemInfo } = mailService.readMail(mailId);

    const inventoryService = new InventoryService(userInfo, updateDate);
    if(itemList.length > 0) {
        const { action, addInfo } = itemInfo;
        inventoryService.putItem(action, addInfo, itemList);
    }

    const inventory = inventoryService.finalize();
    const userService = new UserService(userInfo, userDao, updateDate);

    userService.setInventory(inventory);
    userService.setMail(userMail);

    mailService.finalize();
    await userService.finalize();

    ctx.$res.success({ mail: Object.values(userMail), inventory });
    
    await next();
}
