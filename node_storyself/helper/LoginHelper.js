
const InventoryService = require("@ss/service/InventoryService");
const EventService = require("@ss/service/EventService");
const MailService = require("@ss/service/MailService");
const QuestService = require("@ss/service/QuestService");
const ProductService = require("@ss/service/ProductService");
const UserResourceService = require("@ss/service/UserResourceService");
const Inventory = require("@ss/models/mongo/Inventory");
const ArrayUtil = require("@ss/util/ArrayUtil");

const loginProcess = async (userInfo, loginDate, userService, authService, sessionDao, sessionId, ctx, setSession) => {
  const eventService = new EventService(userInfo, loginDate);
  const inventoryService = new InventoryService(userInfo, loginDate);
  const mailService = new MailService(userInfo, loginDate);

  let isNewUser = false;

  if (userService.isNewUser()) {
    const itemList = eventService.newUserEvent();
    const putItem = inventoryService.putItem(
      InventoryService.PUT_ACTION.USER_INIT,
      {},
      ArrayUtil.map(itemList, (item) => new Inventory(item))
    );

    const initHoneyHistory = inventoryService.createPutHoneyHistory(
      putItem,
      InventoryService.PUT_ACTION.USER_INIT
    );
    userService.addHoneyHistory(initHoneyHistory);
    isNewUser = true;
  }

  const eventResult = await eventService.checkEvent();

  const { eventItemList, eventMailList } = eventResult || {};

  inventoryService.putEventItemList(eventItemList);
  const mail = mailService.putEventMailList(eventMailList);
  if (mail) userService.setMail(mail);

  const smc = inventoryService.checkStoryMerge();
  userService.setSMC(smc);

  const userInventory = inventoryService.finalize();
  userService.setInventory(userInventory);

  const productService = new ProductService(userInfo, loginDate);
  const { subscribeInfo } = await productService.checkRenewReceipt();

  if (userService.setSubscribeInfo(subscribeInfo)) {
    productService.finalize();
  }

  await eventService.finalize();
  await userService.finalize();
  authService.finalize(userInfo.uid);
  
  const userResourceService = new UserResourceService(userInfo, loginDate);
  const modelList = await userResourceService.checkModel();
  const scriptList = await userResourceService.checkScript();
  const stickerList = await userResourceService.checkCustomSticker();
  const userPlayDataMeta = await userResourceService.checkUserPlayData();

  await userResourceService.finalize();

  const { fcmToken } = userInfo;
  const eventList = [];

  setSession();
  
  ctx.$userInfo = userInfo;
  const puid = userInfo.getPUID();
  const email = userInfo.getEmail();

  productService.addSubscribeCheckDate(subscribeInfo);
  productService.removeUnusedParams(subscribeInfo);

  return {
    sessionId,
    puid,
    email, 
    policyVersion: 1,
    fcmToken,
    eventList,
    mail: userService.getMailList(),
    inventory: userService.getInventory(),
    honeyHistory: userService.getHoneyHistory(),
    productPurchase: userService.getProductPurhcase(),
    isNewUser,
    feedback: userService.getFeedback(),
    subscriber: userService.getSubscriber(),
    subscribeCoupon: userService.getSubscribeCoupon(),
    subscribeInfo,
    modelList,
    scriptList,
    stickerList,
    userPlayDataMeta,
    ktUID: userService.getKTUID()
  };
}

module.exports.loginProcess = loginProcess;