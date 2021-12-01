const ReqStickerAttach = require("@ss/models/controller/ReqStickerAttach");
const UserService = require("@ss/service/UserService");

const PageSticker = require("@ss/models/mongo/PageSticker");

const SSError = require("@ss/error");
const nanoid = require("nanoid");

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
  if (!reqStickerAttach.stickerId && stickerInfoList.length >= qny) {
    ctx.$res.badRequest(SSError.Service.Code.useItemNotEnoughItem);
    await next();
    return;
  }

  const totalStickerInfoList = userService.getPageSticker();

  let stickerId = reqStickerAttach.getStickerId();
  if (stickerId) {
    const stickerInfo = totalStickerInfoList.find(
      (item) => item.stickerId === stickerId
    );
    if (!stickerInfo) {
      ctx.$res.badRequest(SSError.Service.Code.noExistPageSticker);
      return;
    }
    stickerInfo.parentId = reqStickerAttach.parentId;
    stickerInfo.x = reqStickerAttach.x;
    stickerInfo.y = reqStickerAttach.y;
    stickerInfo.rot = reqStickerAttach.rot;
    stickerInfo.scaleX = reqStickerAttach.scaleX;
    stickerInfo.scaleY = reqStickerAttach.scaleY;
    stickerInfo.depth = reqStickerAttach.depth;
  } else {
    if (!totalStickerInfoList) stickerInfoList = [];
    // 신규 스티커 아이디 발급
    stickerId = nanoid(6);
    totalStickerInfoList.push(
      new PageSticker({ ...reqStickerAttach, stickerId })
    );
  }

  userService.setPageSticker(totalStickerInfoList);
  userService.finalize();
  // userService업데이트

  ctx.$res.success({
    stickerId,
    pageStickerList: totalStickerInfoList,
  });

  await next();
};
