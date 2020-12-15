const CommonAuthService = require('@ss/service/CommonAuthService');

module.exports = async (ctx, next) => {
    await CommonAuthService(ctx, next);
};