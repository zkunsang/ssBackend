const ReqProductUpdateMany = require('@ss/models/cmsController/ReqProductUpdateMany');
const ProductDao = require('@ss/daoMongo/ProductDao');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductUpdateMany = new ReqProductUpdateMany(ctx.request.body);
    ReqProductUpdateMany.validModel(reqProductUpdateMany);

    const productDao = new ProductDao(ctx.$dbMongo);
    
    const itemList = reqProductUpdateMany.getProductList();
    
    await productDao.deleteAll();
    await insertProductList(productDao, itemList, updateDate);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}


async function insertProductList(productDao, itemList, updateDate) {
    
    const insertItemList = ProductDao.mappingList(itemList);
    for(const item of insertItemList) {
        item.setUpdateDate(updateDate);
    }

    await productDao.insertMany(insertItemList);
}

