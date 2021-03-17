const ReqCheatDelMail = require('@ss/models/controller/ReqCheatDelMail');

const UserService = require('@ss/service/UserService');
const MailService = require('@ss/service/MailService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;
    
    const reqCheatDelMail = new ReqCheatDelMail(ctx.request.body);
    ReqCheatDelMail.validModel(reqCheatDelMail);

    const mailService = new MailService(userInfo, updateDate);
    const mailId = reqCheatDelMail.getMailId();
    const delId = reqCheatDelMail.getDelId();

    const delMail = mailService.delMail(mailId, delId);

    const userService = new UserService(userInfo, userDao);
    userService.setMail(delMail);

    mailService.finalize();
    await userService.finalize();

    ctx.$res.success({ mail: Object.values(delMail) });
    
    await next();
}
