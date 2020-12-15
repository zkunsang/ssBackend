const ReqIPList = require('@ss/models/umsController/ReqIPList');

const IPDao = require('@ss/daoMongo/IPDao');

module.exports = async (ctx, next) => {
    const ipDao = new IPDao(ctx.$dbMongo);
    const ipList = await ipDao.findAll();

    ctx.status = 200;
    ctx.body.data = { ipList };
    await next();
}