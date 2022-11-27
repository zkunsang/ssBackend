const ServiceVariableDao = require('@ss/daoMongo/ServiceVariableDao');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');
const VariableKey = ServiceVariable.VariableKey;

module.exports = async (ctx, next) => {
    const serviceVariableDao = new ServiceVariableDao(ctx.$dbMongo);

    const aosAppVersion = await serviceVariableDao.findOne({key: VariableKey.aosAppVersion});
    const iosAppVersion = await serviceVariableDao.findOne({key: VariableKey.iosAppVersion});
    const ktAppVersion = await serviceVariableDao.findOne({key: VariableKey.ktAppVersion});

    ctx.status = 200;
    ctx.body.data = { aosAppVersion, iosAppVersion, ktAppVersion };

    await next();
}