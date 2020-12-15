const ReqItemDelete = require('@ss/models/cmsController/ReqItemDelete');
const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');

module.exports = async (ctx, next) => {

    const reqItemDelete = new ReqItemDelete(ctx.request.body);
    ReqItemDelete.validModel(reqItemDelete);

    const itemDao = new ItemDao(ctx.$dbMongo);
    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);

    const itemId = reqItemDelete.getItemId();
    const findItemInfo = await itemDao.findOne({itemId});

    if(!findItemInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'already not exist item' };    
        await next();
        return;
    }

    await itemDao.deleteOne({itemId});

    const findMaterialList = await itemMaterialDao.findMany({itemId});
    await itemMaterialDao.deleteMany({itemId}, findMaterialList.length);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

