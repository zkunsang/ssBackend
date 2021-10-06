const ReqStickerAttach = require('@ss/models/controller/ReqStickerAttach');
const UserService = require('@ss/service/UserService');

const PageSticker = require('@ss/models/mongo/PageSticker');

const SSError = require('@ss/error');
const nanoid = require('nanoid');

module.exports = async (ctx, next) => {
    const reqStickerAttach = new ReqStickerAttach(ctx.request.body);
    ReqStickerAttach.validModel(reqStickerAttach);

    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    const userDao = ctx.$userDao;

    const userService = new UserService(userInfo, userDao, updateDate);

    const itemId = reqStickerAttach.getItemId();
    const qny = userService.getItemQny(itemId);

    if (qny === 0) {
        ctx.$res.badRequest(SSError.Service.Code.useItemNotEnoughItem);
        await next();
        return;
    }

    const stickerInfoList = userService.getPageSticker(itemId);

    // 사이즈 비교
    if (stickerInfoList.length >= qny) {
        ctx.$res.badRequest(SSError.Service.Code.useItemNotEnoughItem);
        await next();
        return;
    }

    let stickerId = reqStickerAttach.getStickerId();
    if (stickerId) {
        const stickerInfo = stickerInfoList.find((item) => item.stickerId === stickerId)
        stickerInfo.x = reqStickerAttach.x;
        stickerInfo.y = reqStickerAttach.y;
        stickerInfo.rot = reqStickerAttach.rot;
        stickerInfo.scaleX = reqStickerAttach.scaleX;
        stickerInfo.scaleY = reqStickerAttach.scaleY;
        stickerInfo.depth = reqStickerAttach.depth;
    } else {
        if (!stickerInfoList) stickerInfoList = [];
        // 신규 스티커 아이디 발급
        stickerId = nanoid(6);
        stickerInfoList.push(new PageSticker({ ...reqStickerAttach, stickerId }))
    }

    userService.setPageSticker(stickerInfoList);
    userService.finalize();
    // userService업데이트

    ctx.$res.success({
        stickerId
    });

    await next();
}