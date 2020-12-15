const DateUtil = require('@ss/util/DateUtil');
const ReqPushCreate = require('@ss/models/umsController/ReqPushCreate');
const PushMessageDao = require('@ss/daoRedis/PushMessageDao');
const UserDao = require('@ss/daoMongo/UserDao');
const dbRedisPB = require('@ss/dbRedisPB');

const PUSH_TYPE = {
    DEVICE: 1,
    APP: 2,
    GROUP: 3
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqPushCreate = new ReqPushCreate(ctx.request.body);
    ReqPushCreate.validModel(reqPushCreate);
    
    const pushMessageDao = new PushMessageDao(dbRedisPB);

    const uid = reqPushCreate.getUID();

    if(reqPushCreate.getPushType() == PUSH_TYPE.DEVICE) {
        const userDao = new UserDao(ctx.$dbMongo);
        const userInfo = await userDao.findOne({uid});

        if(userInfo) {
            reqPushCreate.fcmToken = userInfo.fcmToken;
        }
    }

    pushMessageDao.lpush(reqPushCreate);

    ctx.status = 200;
    ctx.body.data = {};

    await next();
};