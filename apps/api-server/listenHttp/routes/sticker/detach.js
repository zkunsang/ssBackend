const ReqStickerDetach = require('@ss/models/controller/ReqStickerDetach');
const UserService = require('@ss/service/UserService');

const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    const reqStickerDetach = new ReqStickerDetach(ctx.request.body);
    ReqStickerDetach.validModel(reqStickerDetach);

    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const userService = new UserService(userInfo, userDao, updateDate);

    const stickerId = reqStickerDetach.getStickerId();
    let pageStickerList = userService.getPageSticker();

    const pageStickerIdx = pageStickerList.findIndex((item) => item.stickerId === stickerId);

    if (pageStickerIdx < 0) {
        ctx.$res.badRequest(SSError.Service.Code.noExistPageSticker);
        return;
    }

    pageStickerList.splice(pageStickerIdx, 1);

    userService.setPageSticker(pageStickerList);
    userService.finalize();

    ctx.$res.success();

    await next();
}