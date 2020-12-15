const ReqItemUpdateManyMaterial = require('@ss/models/cmsController/ReqItemUpdateManyMaterial');

const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
const DataTableDao = require('@ss/daoMongo/DataTableDao');
const DataTable = require('@ss/models/mongo/DataTable');

const DataTableService = require('@ss/helper/DataTableVersionHelper');

module.exports = async (ctx, next) => {    
    const updateDate = ctx.$date;
    const reqItemUpdateManyMaterial = new ReqItemUpdateManyMaterial(ctx.request.body);
    ReqItemUpdateManyMaterial.validModel(reqItemUpdateManyMaterial);

    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);
    const itemMaterialList = reqItemUpdateManyMaterial.getMaterialList();
    await itemMaterialDao.deleteAll();
    await insertItemMaterialList(itemMaterialDao, itemMaterialList, updateDate);

    const tableVersion = await DataTableService.getTableVersion(ctx, DataTable.TableIdList.ITEM_EXCHANGE);
    
    ctx.status = 200;
    ctx.body.data = { tableVersion };
    await next();
}

async function insertItemMaterialList(itemMaterialDao, materialList, updateDate) {
    const insertMaterialList = ItemMaterialDao.mappingList(materialList);
    for(const item of insertMaterialList) {
        item.setUpdateDate(updateDate);
    }
    
    await itemMaterialDao.insertMany(insertMaterialList);
}