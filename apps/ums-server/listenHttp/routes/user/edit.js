const shortid = require("shortid");
const dbMongo = require('@ss/dbMongo');

const UserEdit = require('@ss/models/mongo/UserEdit');
const UmsUserEditDao = require('@ss/daoMongo/UmsUserEditDao');

const UserDao = require('@ss/daoMongo/UserDao');
const InventoryLogDao = require('@ss/daoMongo/log/InventoryLogDao');
const InventoryService = require('@ss/service/InventoryService');

const ReqUserEdit = require('@ss/models/umsController/ReqUserEdit');
const DateUtil = require('@ss/util/DateUtil');

function utsToDsObj(inventoryList) {
    for(const inventory of inventoryList) {
        DateUtil.utsToDsObj(inventory, 'updateDate');
        DateUtil.utsToDsObj(inventory, 'createDate');
    }
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqUserEdit = new ReqUserEdit(ctx.request.body);
    ReqUserEdit.validModel(reqUserEdit);

    const uid = reqUserEdit.getUid();
    const inventoryList = reqUserEdit.getInventoryList();
    const reason = reqUserEdit.getReason();

    const putList = [];
    const useList = [];

    for(const item of inventoryList) {
        if (item.itemQny == 0) continue;
        if (item.itemQny > 0) putList.push(item);
        else {
            item.itemQny = item.itemQny * -1;
            useList.push(item);
        }
    }
    
    const putInventoryList = InventoryService.makeInventoryList(putList);
    const useInventoryList = InventoryService.makeInventoryList(useList);

    const userDao = new UserDao(dbMongo);

    const userInfo = await userDao.findOne({uid});

    const inventoryLogDao = new InventoryLogDao(dbMongo, updateDate);
    const inventoryService = new InventoryService(userInfo, updateDate, inventoryLogDao);
    InventoryService.validModel(inventoryService);

    const adminId = ctx.$adminInfo.adminId;
    const editKey = shortid.generate();
    
    const adminInfo = { adminId, editKey };
    const addInfo = { adminInfo };

    const userEdit = new UserEdit({ uid, adminId, editKey, reason, updateDate });
    
    const umsUserEditDao = new UmsUserEditDao(dbMongo);
    const result = umsUserEditDao.insertOne(userEdit);

    if(putInventoryList.length > 0) {
        inventoryService.processPut(
            InventoryService.PUT_ACTION.ADMIN, 
            putInventoryList, 
            addInfo);
    }
        
    if(useInventoryList.length > 0) {
        inventoryService.processUse(
            InventoryService.USE_ACTION.ADMIN, 
            useInventoryList,
            addInfo);
    }
    
    ctx.status = 200;
    ctx.body.data = {};

    await next();
};