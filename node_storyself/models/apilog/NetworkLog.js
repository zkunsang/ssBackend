const moment = require('moment')
const DateUtil = require('../../util/DateUtil');
const Model = require('../')

const Schema = {}

class NetworkLog extends Model {
  constructor(ctx, startDate, endDate) {
    super();
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
    ctx.body.common.ms = this.ms;
    this.endDate = DateUtil.utsToDs(endDate);
    this.startDate = DateUtil.utsToDs(startDate);

    if (ctx.$userInfo) {
      this.uid = ctx.$userInfo.getUID();
    }
  }
}

module.exports = NetworkLog;
module.exports.Schema = Schema;