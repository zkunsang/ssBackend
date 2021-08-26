const ReqSaleEventUpdateMany = require('@ss/models/cmsController/ReqSaleEventUpdateMany');
const SaleEventDao = require('@ss/daoMongo/SaleEventDao');
const SaleEvent = require('@ss/models/mongo/SaleEvent');

const dbRedisPB = require('@ss/dbRedisPB');
const Channels = dbRedisPB.Channels;


module.exports = async (ctx, next) => {
    const reqSaleEventUpdateMany = new ReqSaleEventUpdateMany(ctx.request.body);
    ReqSaleEventUpdateMany.validModel(reqSaleEventUpdateMany);

    const saleEventDao = new SaleEventDao(ctx.$dbMongo);

    await saleEventDao.deleteAll();

    await saleEventDao.insertOne(new SaleEvent(reqSaleEventUpdateMany));

    ctx.status = 200;
    ctx.body.data = {};

    dbRedisPB.publish(Channels.saleEvent, 'need refresh');
    await next();
}