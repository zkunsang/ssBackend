const moment = require('moment')
const NetworkLog = require('@ss/models/apilog/NetworkLog.js')

const helper = require('@ss/helper');
const SSError = require('@ss/error');

const dbRedisPB = require('@ss/dbRedisPB');
const DateUtil = require('@ss/util/DateUtil');


const ReqContext = require('@ss/context/ReqContext');
const ResContext = require('@ss/context/ResContext');

const IPCache = require('@ss/dbCache/IPCache');

function checkServerBlock(date) {
    // serverBlock으로 변경
    if (dbRedisPB.serverStatus.status == 0)
        return false;

    const { startDate, endDate } = dbRedisPB.serverStatus;

    return DateUtil.isBetween(date, startDate, endDate);
}

function checkWhiteList(ip) {
    return IPCache.getWhiteIP(ip);
}

module.exports = async (ctx, next) => {
    try {
        ctx.$date = moment().valueOf();

        ctx.$req = new ReqContext(ctx);
        ctx.$res = new ResContext(ctx);

        if (checkServerBlock(ctx.$date)) {
            if (!checkWhiteList(ctx.$req.clientIp)) {
                ctx.$res.serviceUnavailable(
                    SSError.Service.CodeMap[dbRedisPB.serverStatus.code],
                    dbRedisPB.serverStatus.message);
                return;
            }
        }

        await next();
    }
    catch (err) {
        if (err instanceof SSError.RunTime) {
            if (err instanceof SSError.Dao) {
                processDaoError(ctx, err);
            }
            else if (err instanceof SSError.Model) {
                processModelError(ctx, err);
            }
            else if (err instanceof SSError.Service) {
                processServiceError(ctx, err);
            }
            else if (err instanceof SSError.Controller) {
                processControllerError(ctx, err);
            }
            else {
                uncaughtError(ctx, err);
            }

            helper.slack.sendMessage(err.makeErrorMessage());
        } else {
            helper.slack.sendMessage(err.stack);
            uncaughtError(ctx, err);
        }
    }

    helper.fluent.sendNetworkLog(new NetworkLog(ctx, ctx.$date, moment().valueOf()));
};

function uncaughtError(ctx, err) {
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processDaoError(ctx, err) {
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processModelError(ctx, err) {
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processServiceError(ctx, err) {
    ctx.body.error = {
        code: err.code,
        message: err.message,
        additional: err.additionalMessage
    };
}

function processControllerError(ctx, err) {
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}