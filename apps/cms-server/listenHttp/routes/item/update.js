const ReqItemUpdate = require('@ss/models/cmsController/ReqItemUpdate');
const Item = require('@ss/models/mongo/Item')

const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqItemUpdate = new ReqItemUpdate(ctx.request.body);
    ReqItemUpdate.validModel(reqItemUpdate);

    const itemDao = new ItemDao(ctx.$dbMongo);
    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);

    const updateItemInfo = new Item(reqItemUpdate.getItemInfo());
    const updateItemMaterialList = reqItemUpdate.getMaterialItemList();

    const itemId = updateItemInfo.getItemId();
    const findItemInfo = await itemDao.findOne({ itemId });

    if (!findItemInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'not exist item' };
        await next();
        return;
    }

    updateItemInfo.setUpdateDate(updateDate);
    delete updateItemInfo[Item.Schema.ITEM_ID.key];

    await itemDao.updateOne({ itemId }, updateItemInfo);

    const findItemMaterialList = await itemMaterialDao.findMany({ itemId });
    await itemMaterialDao.deleteMany({ itemId }, findItemMaterialList.length);

    await insertMaterialList(itemMaterialDao, updateItemMaterialList, updateDate);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertMaterialList(itemMaterialDao, list, updateDate) {
    const materialList = ItemMaterialDao.mappingList(list);

    for(const item of materialList) {
        item.setUpdateDate(updateDate);
    }
    
    await itemMaterialDao.insertMany(materialList);
}