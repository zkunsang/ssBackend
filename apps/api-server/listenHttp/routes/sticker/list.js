const ReqStickerDetach = require('@ss/models/controller/ReqStickerDetach');
const UserService = require('@ss/service/UserService');

const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const userService = new UserService(userInfo, userDao, updateDate);

    let pageStickerList = userService.getPageSticker();

    ctx.$res.success({ pageStickerList });

    await next();
}