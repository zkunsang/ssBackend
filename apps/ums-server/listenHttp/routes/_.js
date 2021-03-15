const moment = require('moment');
const helper = require('@ss/helper');
const SSError = require('@ss/error');

const ReqContext = require('@ss/context/ReqContext');
const ResContext = require('@ss/context/ResContext');

module.exports = async (ctx, next) => {
    ctx.$date = moment().unix();

    ctx.$req = new ReqContext(ctx);
    ctx.$res = new ResContext(ctx);

    ctx.body = ctx.body || {};
    try {
        await next();        
    }
    catch (err) {
        if(err instanceof SSError.RunTime) {
            helper.slack.sendMessage(err.makeErrorMessage());
        } else {
            helper.slack.sendMessage(err);
        }
        console.error(err);
        ctx.status = 400;
        ctx.body.error = { message: err.message };
        ctx.body.data = { message: err.message };
    }
};