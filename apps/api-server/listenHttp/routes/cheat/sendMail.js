const ReqCheatSendMail = require('@ss/models/controller/ReqCheatSendMail');
const MailSendLogDao = require('@ss/daoMongo/log/MailSendLogDao');


const InventoryService = require('@ss/service/InventoryService');
const UserService = require('@ss/service/UserService');
const MailService = require('@ss/service/MailService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;
    
    const reqCheatSendMail = new ReqCheatSendMail(ctx.request.body);
    ReqCheatSendMail.validModel(reqCheatSendMail);

    const mailService = new MailService(userInfo, updateDate);

    const itemInfo = {
        action: InventoryService.PUT_ACTION.CHEAT,
        addInfo: { cheat: 'cheat' },    
    };

    
    mailService.sendMail({ ...reqCheatSendMail, itemInfo });
    const newMail = mailService.finalize();

    const userService = new UserService(userInfo, userDao, updateDate);
    userService.setMail(newMail);
    
    await userService.finalize();

    const { mail, inventory } = userInfo;

    ctx.$res.success({ mail: Object.values(mail), inventory });
    
    await next();
}
