const ReqItemCreate = require('@ss/models/cmsController/ReqItemCreate');
const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
const Item = require('@ss/models/mongo/Item');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqItemCreate = new ReqItemCreate(ctx.request.body);
    ReqItemCreate.validModel(reqItemCreate);

    const itemDao = new ItemDao(ctx.$dbMongo);
    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);
    
    const itemInfo = new Item(reqItemCreate.getItemInfo());
    const itemId = itemInfo.getItemId();

    const findItemInfo = await itemDao.findOne({itemId});

    if(findItemInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist item' };    
        await next();
        return;
    }

    const itemMaterialList = await itemMaterialDao.findMany({itemId});

    if(itemMaterialList.length > 0 ){
        ctx.status = 400;
        ctx.body.data = { message: 'already exist material item' };    
        await next();
        return;
    }

    itemInfo.setUpdateDate(updateDate);
    await itemDao.insertOne(itemInfo);

    const materialList = ItemMaterialDao.mappingList(reqItemCreate.getMaterialItemList());
    setMaterialListupdateDate(materialList, updateDate);
    await itemMaterialDao.insertMany(materialList);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

function setMaterialListupdateDate(materialList, updateDate) {
    materialList.map((item) => item.setUpdateDate(updateDate));
}