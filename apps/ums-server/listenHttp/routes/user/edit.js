const shortid = require("shortid");
const dbMongo = require('@ss/dbMongo');

const UserEdit = require('@ss/models/mongo/UserEdit');
const UmsUserEditDao = require('@ss/daoMongo/UmsUserEditDao');

const UserDao = require('@ss/daoMongo/UserDao');
const InvenLogDao = require('@ss/daoMongo/InvenLogDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
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
    const inventoryDao = new InventoryDao(dbMongo);

    const userInfo = await userDao.findOne({uid});

    const invenLogDao = new InvenLogDao(dbMongo, updateDate);
    const inventoryService = new InventoryService(inventoryDao, userInfo, updateDate, invenLogDao);
    InventoryService.validModel(inventoryService);

    const adminId = ctx.$adminInfo.adminId;
    const editKey = shortid.generate();
    
    const adminInfo = { adminId, editKey };
    const addInfo = { adminInfo };

    const userEdit = new UserEdit({ uid, adminId, editKey, reason, updateDate });
    
    const umsUserEditDao = new UmsUserEditDao(dbMongo);
    const result = await umsUserEditDao.insertOne(userEdit);

    if(putInventoryList.length > 0) {
        await inventoryService.processPut(
            InventoryService.PUT_ACTION.ADMIN, 
            putInventoryList, 
            addInfo);
    }
        
    if(useInventoryList.length > 0) {
        await inventoryService.processUse(
            InventoryService.USE_ACTION.ADMIN, 
            useInventoryList,
            addInfo);
    }
    
    ctx.status = 200;
    ctx.body.data = {};

    await next();
};