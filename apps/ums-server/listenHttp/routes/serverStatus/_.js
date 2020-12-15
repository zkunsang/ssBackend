const { commonAuthCheck } = require('@ss/util/RouteUtil');

module.exports = async (ctx, next) => {
    await commonAuthCheck(ctx, next);
};