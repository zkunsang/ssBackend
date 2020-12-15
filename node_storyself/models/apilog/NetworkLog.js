const moment = require('moment')
const DateUtil = require('../../util/DateUtil');

class NetworkLog {
    constructor(ctx, startDate, endDate) {
        this.pathname = ctx.path;
        this.ip = ctx.$req.clientIp;

        const body = ctx.request.body;
        this.deviceId = body.deviceId;
        this.deviceName = body.deviceName;
        this.osVersion = body.osVersion;
        this.gameLanguage = body.gameLanguage;

        this.body = JSON.stringify(ctx.request.body);
        // this.body = ctx.request.body;
        this.res = ctx.body;
        this.status = ctx.status;
        this.ms = endDate - startDate;
        this.endDate = moment(endDate).format(DateUtil.DEFAULT_FORMAT);
        this.startDate = moment(startDate).format(DateUtil.DEFAULT_FORMAT);
    }
}

module.exports = NetworkLog;