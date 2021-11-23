const ReqStickerDetach = require("@ss/models/controller/ReqStickerDetach");
const UserService = require("@ss/service/UserService");

const SSError = require("@ss/error");

module.exports = async (ctx, next) => {
  const reqStickerDetach = new ReqStickerDetach(ctx.request.body);
  ReqStickerDetach.validModel(reqStickerDetach);

  const updateDate = ctx.$date;
  const userInfo = ctx.$userInfo;
  const userDao = ctx.$userDao;

  const userService = new UserService(userInfo, userDao, updateDate);

  const stickerIds = reqStickerDetach.getStickerIds();
  let pageStickerList = userService.getPageSticker();

  const toRemove = new Set([...stickerIds]);
  const result = pageStickerList.filter(
    (sticker) => !toRemove.has(sticker.stickerId)
  );

  if (result.length === pageStickerList.length) {
    ctx.$res.badRequest(SSError.Service.Code.noExistPageSticker);
    return;
  }

  userService.setPageSticker(result);
  userService.finalize();

  ctx.$res.success({
    pageStickerList: result,
  });

  await next();
};
