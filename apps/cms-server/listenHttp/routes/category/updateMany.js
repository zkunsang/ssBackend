const ReqCategoryUpdateMany = require('@ss/models/cmsController/ReqCategoryUpdateMany');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemCategory = require('@ss/models/mongo/ItemCategory');

const ArrayUtil = require('@ss/util/ArrayUtil');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqCategoryUpdateMany = new ReqCategoryUpdateMany(ctx.request.body);
    ReqCategoryUpdateMany.validModel(reqCategoryUpdateMany);

    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const beforeList = await itemCategoryDao.findAll();
    const afterList = ItemCategoryDao.mappingList(reqCategoryUpdateMany.getCategoryList());

    const { insertList, updateList } = ArrayUtil.compareArrayByKey(beforeList,
        afterList,
        ItemCategory.Schema.ITEM_CATEGORY.key);

    // if (deleteList.length > 0) {
    //     deleteList = [];
        
    //     // ctx.status = 200;
    //     // const deleteCategory =
    //     //     ArrayUtil.getArrayValueByKey(deleteList, ItemCategory.Schema.ITEM_CATEGORY.key);
    //     // ctx.body.data = { message: `delete method not allowed - ${deleteCategory.join(',')}` };
    //     // await next();
    //     // return;
    // }

    await updateCategoryList(itemCategoryDao, updateList, updateDate);
    await insertCategoryList(itemCategoryDao, insertList, updateDate)

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertCategoryList(itemCategoryDao, insertList, updateDate) {
    for (const insertItem of insertList) {
        insertItem.setUpdateDate(updateDate);
    }

    await itemCategoryDao.insertMany(insertList);
}

async function updateCategoryList(itemCategoryDao, updateList, updateDate) {
    for (const updateItem of updateList) {
        updateItem.setUpdateDate(updateDate);

        const itemCategory = updateItem.getItemCategory();
        delete updateItem[ItemCategory.Schema.ITEM_CATEGORY.key];

        await itemCategoryDao.updateOne({ itemCategory }, updateItem);
    }
}
