const ReqItemUpdateMany = require('@ss/models/cmsController/ReqItemUpdateMany');
const ItemDao = require('@ss/daoMongo/ItemDao');

async function insertItemList(itemDao, itemList, updateDate) {
    const insertItemList = ItemDao.mappingList(itemList);
    for(const item of insertItemList) {
        item.setUpdateDate(updateDate);
    }

    await itemDao.insertMany(insertItemList);
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqUpdateMany = new ReqItemUpdateMany(ctx.request.body);
    ReqItemUpdateMany.validModel(reqUpdateMany);

    const itemDao = new ItemDao(ctx.$dbMongo);
    
    const itemList = reqUpdateMany.getItemList();
    
    await itemDao.deleteAll();
    await insertItemList(itemDao, itemList, updateDate);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}