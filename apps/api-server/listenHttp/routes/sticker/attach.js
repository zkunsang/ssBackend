const ReqStickerAttach = require('@ss/models/controller/ReqStickerAttach');
const UserService = require('@ss/service/UserService');

const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    // 데이터 버젼 테이블만 내려 받는 형식으로 변경
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

    const stickerInfoList = userService.getStickerInfos(itemId);

    const stickerId = reqStickerAttach.getStickerId();

    // 사이즈 비교
    if (stickerInfoList.length >= qny) {
        ctx.$res.badRequest(SSError.Service.Code.useItemNotEnoughItem);
        await next();
        return;
    }

    let _stickerInfo = null;
    for (const stickerInfo in stickerInfoList) {
        if (stickerInfo.stickerId = stickerId) {
            _stickerInfo = stickerInfo;
        }
    }

    if (!_stickerInfo) stickerInfoList.push(new StickerInfo());

    // userService업데이트

    // 있으면 update
    // 없으면 insert





    await next();

}